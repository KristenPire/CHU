/**
 * Loads src/data/ into the database.
 *
 * Only the course folders listed in import-map.json are imported, so the
 * catalogue is opened one course at a time rather than all at once. The JSON
 * files are the reference import format and are never modified.
 *
 * The whole run is one transaction: either the database ends up holding every
 * grade of every listed course, or it is left exactly as it was.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(HERE, "..", "data");
const IMPORT_MAP = join(HERE, "import-map.json");

// Accounts used to demonstrate the site, not students.
const DEMO_ACCOUNTS = new Set(["20230001", "20230002", "20230003", "1234", "5678"]);

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function exists(path) {
  try {
    await readdir(path);
    return true;
  } catch {
    return false;
  }
}

/** The academic year a promotion sits a given level: entering in Y, level N, year Y + N - 1. */
function academicYear(entryYear, level) {
  return entryYear + Number(level.slice(1)) - 1;
}

async function importCourse(client, folder, entryYear, counters, log) {
  const courseDir = join(DATA_DIR, folder);
  if (!(await exists(courseDir))) {
    throw new Error(`import-map.json lists "${folder}" but src/data/${folder} does not exist`);
  }

  const course = (await client.query("select id, level, semester from courses where code = $1", [folder])).rows[0];
  if (!course) {
    throw new Error(`no course with code "${folder}" in the catalogue; add it in a migration first`);
  }

  const cohort = (
    await client.query(
      `insert into cohorts (entry_year) values ($1)
       on conflict (entry_year) do update set entry_year = excluded.entry_year
       returning id, (xmax = 0) as created`,
      [entryYear],
    )
  ).rows[0];
  if (cohort.created) counters.cohorts += 1;

  const year = academicYear(entryYear, course.level);
  const klass = (
    await client.query(
      `insert into classes (course_id, cohort_id, academic_year, level, semester)
       values ($1, $2, $3, $4, $5)
       on conflict (course_id, cohort_id, academic_year) do update set level = excluded.level
       returning id, (xmax = 0) as created`,
      [course.id, cohort.id, year, course.level, course.semester],
    )
  ).rows[0];
  if (klass.created) counters.classes += 1;

  const entries = (await readdir(courseDir, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  for (const entry of entries) {
    const dir = join(courseDir, entry);
    const info = await readJson(join(dir, "info.json"));
    const kind = info.type === "project" ? "project" : "exam";

    // Stored as written; an assessment without a body.json simply has none.
    const body = await readFile(join(dir, "body.json"), "utf8").catch(() => null);

    const assessment = (
      await client.query(
        `insert into assessments
             (class_id, num, kind, title, total_points, coeff, body,
              published_at, held_on, starts_on, due_on)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         on conflict (class_id, num) do update set
             kind = excluded.kind, title = excluded.title,
             total_points = excluded.total_points, coeff = excluded.coeff,
             body = excluded.body, published_at = excluded.published_at,
             held_on = excluded.held_on, starts_on = excluded.starts_on,
             due_on = excluded.due_on
         returning id, (xmax = 0) as created`,
        [
          klass.id,
          Number(entry),
          kind,
          info.title,
          info.totalPoints,
          info.coeff,
          body,
          // A project carries no publication date of its own: it is on the site,
          // so its deadline is the day its grades became readable. Leaving this
          // null would hide it from student_grades_v entirely.
          info.publishedDate ?? info.date ?? info.deadline ?? null,
          info.date ?? null,
          info.startDate ?? null,
          info.deadline ?? null,
        ],
      )
    ).rows[0];
    if (assessment.created) counters.assessments += 1;

    if (kind === "project") {
      await importGroups(client, dir, assessment.id, cohort.id, counters, log);
    } else {
      await importExamGrades(client, dir, assessment.id, cohort.id, counters);
    }
  }
}

/** Registers a student without their name, and returns nothing. */
async function ensureStudent(client, studentId, cohortId, counters) {
  // A student already known keeps the cohort they were given — a repeater's
  // cohort is corrected by hand and an import must not undo it.
  const inserted = await client.query(
    `insert into students (id, cohort_id) values ($1, $2)
     on conflict (id) do nothing`,
    [studentId, cohortId],
  );
  counters.students += inserted.rowCount;
}

/**
 * The guard on the update is not an optimisation: without it, re-importing
 * rewrites every grade to its own value and the audit trigger records a change
 * where nothing changed.
 */
async function upsertGrade(client, assessmentId, studentId, grade, report, counters) {
  const graded = await client.query(
    `insert into grades (assessment_id, student_id, grade, report)
     values ($1, $2, $3, $4)
     on conflict (assessment_id, student_id) do update set
         grade = excluded.grade, report = excluded.report
     where grades.grade  is distinct from excluded.grade
        or grades.report is distinct from excluded.report
     returning (xmax = 0) as created`,
    [assessmentId, studentId, grade ?? null, report ?? null],
  );
  if (graded.rows[0]?.created) counters.grades += 1;
  return graded.rowCount > 0;
}

async function importExamGrades(client, dir, assessmentId, cohortId, counters) {
  const students = await readJson(join(dir, "students.json"));

  for (const [studentId, record] of Object.entries(students)) {
    if (DEMO_ACCOUNTS.has(studentId)) {
      counters.skipped += 1;
      continue;
    }
    // record.name is read and deliberately dropped: no student name enters the
    // database.
    await ensureStudent(client, studentId, cohortId, counters);
    await upsertGrade(client, assessmentId, studentId, record.grade, null, counters);
  }
}

/**
 * A project is graded by group: every member of a group receives the group's
 * grade and its correction report.
 *
 * groupName is read and deliberately dropped. In the data it is almost always a
 * student's first name or nickname, and no student name enters the database. A
 * group is identified by its position in groups.json, which is stable across
 * re-imports as long as the file is appended to rather than reordered.
 */
async function importGroups(client, dir, assessmentId, cohortId, counters, log) {
  const groups = await readJson(join(dir, "groups.json"));

  for (const [index, group] of groups.entries()) {
    const num = index + 1;

    const row = (
      await client.query(
        `insert into groups (assessment_id, num, repository_url, comments)
         values ($1, $2, $3, $4)
         on conflict (assessment_id, num) do update set
             repository_url = excluded.repository_url, comments = excluded.comments
         returning id, (xmax = 0) as created`,
        [assessmentId, num, group.repositoryLink ?? null, group.comments ?? null],
      )
    ).rows[0];
    if (row.created) counters.groups += 1;

    let report = null;
    if (group.markdown) {
      report = await readFile(join(dir, "markdown", group.markdown), "utf8").catch(() => null);
      // Say it rather than skip it: a missing report is a mistake in the data,
      // and silence would let a student's correction disappear unnoticed.
      if (report === null) log(`missing report: ${dir}/markdown/${group.markdown}`);
    }

    let reportWritten = false;
    for (const studentId of Object.keys(group.members ?? {})) {
      if (DEMO_ACCOUNTS.has(studentId)) {
        counters.skipped += 1;
        continue;
      }
      await ensureStudent(client, studentId, cohortId, counters);

      const member = await client.query(
        `insert into group_members (group_id, student_id, assessment_id) values ($1, $2, $3)
         on conflict do nothing`,
        [row.id, studentId, assessmentId],
      );
      counters.members += member.rowCount;

      // Counted like every other counter: what the run changed, not what it
      // read. A second run that writes nothing must report zero.
      const wrote = await upsertGrade(client, assessmentId, studentId, group.grade, report, counters);
      if (wrote && report !== null) reportWritten = true;
    }
    if (reportWritten) counters.reports += 1;
  }
}

export async function runImport({ connectionString, log = console.log, importMap } = {}) {
  const url = connectionString ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env, then run docker compose up -d db.");
  }

  // Tests pass their own map so that proving the importer works on a project
  // does not require committing a decision about which promotion sat a course.
  const map = importMap ?? (await readJson(IMPORT_MAP));
  const counters = {
    cohorts: 0, classes: 0, assessments: 0, students: 0, grades: 0,
    groups: 0, members: 0, reports: 0, skipped: 0,
  };

  const present = (await readdir(DATA_DIR, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
  for (const folder of present) {
    if (!(folder in map)) log(`ignored: src/data/${folder} is not in import-map.json`);
  }

  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    await client.query("begin");
    // Travels with the transaction, so the audit trigger attributes every row
    // it writes to the import rather than to "unknown".
    await client.query("set local app.actor = 'import'");
    await client.query("set local app.source = 'import'");

    for (const [folder, entryYear] of Object.entries(map)) {
      await importCourse(client, folder, entryYear, counters, log);
    }
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    await client.end();
  }

  log(
    `imported: ${counters.cohorts} cohort(s), ${counters.classes} class edition(s), ` +
      `${counters.assessments} assessment(s), ${counters.students} student(s), ` +
      `${counters.grades} grade(s), ${counters.groups} group(s), ` +
      `${counters.members} membership(s), ${counters.reports} report(s); ` +
      `${counters.skipped} demo account(s) skipped`,
  );
  return counters;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runImport().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
