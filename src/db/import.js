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

async function importCourse(client, folder, entryYear, counters) {
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

    if (info.type === "project") {
      throw new Error(
        `${folder}/${entry} is a project: group import is not implemented yet. ` +
          `Remove "${folder}" from import-map.json until it is.`,
      );
    }

    // Stored as written; an exam without a body.json simply has none.
    const body = await readFile(join(dir, "body.json"), "utf8").catch(() => null);
    const students = await readJson(join(dir, "students.json"));

    const assessment = (
      await client.query(
        `insert into assessments (class_id, num, kind, title, total_points, coeff, body, published_at)
         values ($1, $2, 'exam', $3, $4, $5, $6, $7)
         on conflict (class_id, num) do update set
             title = excluded.title, total_points = excluded.total_points,
             coeff = excluded.coeff, body = excluded.body, published_at = excluded.published_at
         returning id, (xmax = 0) as created`,
        [
          klass.id,
          Number(entry),
          info.title,
          info.totalPoints,
          info.coeff,
          body,
          info.publishedDate ?? info.date,
        ],
      )
    ).rows[0];
    if (assessment.created) counters.assessments += 1;

    for (const [studentId, record] of Object.entries(students)) {
      if (DEMO_ACCOUNTS.has(studentId)) {
        counters.skipped += 1;
        continue;
      }

      // record.name is read and deliberately dropped: no student name enters
      // the database. A student already known keeps the cohort they were given
      // — a repeater's cohort is corrected by hand and an import must not undo it.
      const inserted = await client.query(
        `insert into students (id, cohort_id) values ($1, $2)
         on conflict (id) do nothing`,
        [studentId, cohort.id],
      );
      counters.students += inserted.rowCount;

      const graded = await client.query(
        // The guard is not an optimisation: without it, re-importing rewrites
        // every grade to its own value and the audit trigger records 97
        // changes where nothing changed.
        `insert into grades (assessment_id, student_id, grade)
         values ($1, $2, $3)
         on conflict (assessment_id, student_id) do update set grade = excluded.grade
         where grades.grade is distinct from excluded.grade
         returning (xmax = 0) as created`,
        [assessment.id, studentId, record.grade ?? null],
      );
      if (graded.rows[0]?.created) counters.grades += 1;
    }
  }
}

export async function runImport({ connectionString, log = console.log } = {}) {
  const url = connectionString ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env, then run docker compose up -d db.");
  }

  const map = await readJson(IMPORT_MAP);
  const counters = { cohorts: 0, classes: 0, assessments: 0, students: 0, grades: 0, skipped: 0 };

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
      await importCourse(client, folder, entryYear, counters);
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
      `${counters.grades} grade(s); ${counters.skipped} demo account(s) skipped`,
  );
  return counters;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runImport().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
