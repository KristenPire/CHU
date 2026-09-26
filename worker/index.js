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

const SUMMARY_SQL = `
    select assessment_id, course_code, course_title, academic_year, level, semester,
           assessment_num, assessment_title, kind, total_points, coeff, grade,
           report is not null as has_report
      from student_grades_v
     where student_id = $1
     order by course_code, assessment_num
`;

const ASSESSMENT_SQL = `
    select assessment_id, course_code, course_title, assessment_num, assessment_title,
           kind, total_points, coeff, grade, report, body
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
      id: row.assessment_id,
      num: row.assessment_num,
      title: row.assessment_title,
      kind: row.kind,
      totalPoints: Number(row.total_points),
      coeff: Number(row.coeff),
      // null means "not graded yet" and is excluded from the average — keep it null.
      grade: row.grade === null ? null : Number(row.grade),
      hasReport: row.has_report,
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
    id: row.assessment_id,
    courseCode: row.course_code,
    courseTitle: row.course_title,
    num: row.assessment_num,
    title: row.assessment_title,
    kind: row.kind,
    totalPoints: Number(row.total_points),
    coeff: Number(row.coeff),
    grade: row.grade === null ? null : Number(row.grade),
    report: row.report,
    body: row.body,
  });
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
