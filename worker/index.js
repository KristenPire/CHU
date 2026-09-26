// The student API — see docs/adr/0006-cloudflare-workers-hosting.md
//
// Every read goes through student_grades_v, never through the tables. The rule
// about what a student may see (published assessment, nothing archived) lives in
// the view, so no endpoint can forget it. See src/db/migrations/0004.
//
// Static assets are served by the platform before this Worker runs; only /api/*
// reaches here, because run_worker_first routes it that way.

import { Client } from "pg";

// Student numbers are 8 digits today, but the demo accounts were 4. Stay lenient
// on the length and strict on the alphabet.
const STUDENT_ID = /^[0-9]{4,10}$/;

// Formatted in SQL rather than in JavaScript: a date column comes back as a
// Date at local midnight, and JSON.stringify would render it in UTC — east of
// Greenwich a deadline would move to the day before.
const DAYS = `
    to_char(held_on,      'YYYY-MM-DD') as held_on,
    to_char(starts_on,    'YYYY-MM-DD') as starts_on,
    to_char(due_on,       'YYYY-MM-DD') as due_on,
    to_char(published_at, 'YYYY-MM-DD') as published_on
`;

const SUMMARY_SQL = `
    select assessment_id, course_code, course_title, academic_year, level, semester,
           assessment_num, assessment_title, kind, total_points, coeff, grade,
           group_num, repository_url, group_comments,
           report is not null as has_report,
           -- Counted here rather than shipped: a card shows "18 correct, 2
           -- wrong", which is two integers, not the exam paper and the answers.
           case when jsonb_typeof(body -> 'questions') = 'array'
                then jsonb_array_length(body -> 'questions') end as question_count,
           case when wrong_answers is null then null
                else (select count(*) from jsonb_object_keys(wrong_answers)) end as wrong_count,
           ${DAYS}
      from student_grades_v
     where student_id = $1
     order by course_code, assessment_num
`;

const ASSESSMENT_SQL = `
    select assessment_id, course_code, course_title, assessment_num, assessment_title,
           kind, total_points, coeff, grade, report, body, wrong_answers,
           group_num, repository_url, group_comments,
           ${DAYS}
      from student_grades_v
     where student_id = $1 and assessment_id = $2
`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method !== "GET") {
      return json({ error: "method not allowed" }, 405);
    }

    let client;
    const connect = async () => {
      client = new Client({ connectionString: env.HYPERDRIVE.connectionString });
      await client.connect();
      return client;
    };

    try {
      if (url.pathname === "/api/health") {
        const db = await connect();
        const { rows } = await db.query("select now() as now");
        return json({ ok: true, now: rows[0].now });
      }

      const summary = url.pathname.match(/^\/api\/students\/([^/]+)$/);
      if (summary) {
        return await studentSummary(decodeURIComponent(summary[1]), connect);
      }

      const detail = url.pathname.match(/^\/api\/students\/([^/]+)\/assessments\/([^/]+)$/);
      if (detail) {
        return await assessmentDetail(
          decodeURIComponent(detail[1]),
          decodeURIComponent(detail[2]),
          connect,
        );
      }

      return json({ error: "not found" }, 404);
    } catch (error) {
      // The message can carry the connection string; log it, never return it.
      console.error("api error", error);
      return json({ error: "internal error" }, 500);
    } finally {
      if (client) ctx.waitUntil(client.end());
    }
  },
};

async function studentSummary(studentId, connect) {
  if (!STUDENT_ID.test(studentId)) return json({ error: "invalid student id" }, 400);

  const db = await connect();
  const { rows } = await db.query(SUMMARY_SQL, [studentId]);

  if (rows.length === 0) {
    // No visible grade is not the same as no such student: a student whose
    // promotion was archived must not be told their own number is unknown.
    const { rows: exists } = await db.query("select 1 from students where id = $1", [studentId]);
    if (exists.length === 0) return json({ error: "unknown student" }, 404);
  }

  const courses = new Map();
  for (const row of rows) {
    if (!courses.has(row.course_code)) {
      courses.set(row.course_code, {
        code: row.course_code,
        title: row.course_title,
        academicYear: row.academic_year,
        level: row.level,
        semester: row.semester,
        assessments: [],
      });
    }
    courses.get(row.course_code).assessments.push({
      ...assessmentFrom(row),
      hasReport: row.has_report,
      questionCount: row.question_count === null ? null : Number(row.question_count),
      // null means no answers were recorded for this exam, which the review
      // screen says differently from "none was wrong".
      wrongCount: row.wrong_count === null ? null : Number(row.wrong_count),
    });
  }

  return json({ studentId, courses: [...courses.values()] });
}

async function assessmentDetail(studentId, assessmentId, connect) {
  if (!STUDENT_ID.test(studentId)) return json({ error: "invalid student id" }, 400);

  const db = await connect();
  const { rows } = await db.query(ASSESSMENT_SQL, [studentId, assessmentId]);
  // Also covers "this assessment belongs to someone else": the view is filtered
  // by student_id, so a mismatched pair returns nothing rather than a leak.
  if (rows.length === 0) return json({ error: "not found" }, 404);

  const row = rows[0];
  return json({
    studentId,
    courseCode: row.course_code,
    courseTitle: row.course_title,
    ...assessmentFrom(row),
    report: row.report,
    body: row.body,
    // null and {} mean different things: no answers were recorded, versus
    // answers were recorded and none was wrong. The review screen says
    // something different in each case.
    wrongAnswers: row.wrong_answers,
  });
}

/**
 * The shape both routes agree on. The summary adds hasReport, the detail adds
 * the report and the body; everything else is described in one place so the two
 * cannot drift into disagreeing about the same assessment.
 *
 * A project carries the group the student sat in — its number, not its name.
 */
function assessmentFrom(row) {
  return {
    id: row.assessment_id,
    num: row.assessment_num,
    title: row.assessment_title,
    kind: row.kind,
    totalPoints: Number(row.total_points),
    coeff: Number(row.coeff),
    // null means "not graded yet" and is excluded from the average — keep it null.
    grade: row.grade === null ? null : Number(row.grade),
    heldOn: row.held_on,
    startsOn: row.starts_on,
    dueOn: row.due_on,
    publishedOn: row.published_on,
    group:
      row.group_num === null
        ? null
        : {
            num: row.group_num,
            repositoryUrl: row.repository_url,
            comments: row.group_comments,
          },
  };
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // Personal data: no shared cache, no browser cache.
      "cache-control": "no-store",
    },
  });
}
