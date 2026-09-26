import { describe, expect, it } from "vitest";
import { migrate } from "../../src/db/migrate.js";
import { runImport } from "../../src/db/import.js";
import { query, resetTestDatabase } from "../helpers/test-database.js";

const silent = () => {};
const count = async (connectionString, table) =>
  Number((await query(connectionString, `select count(*) from ${table}`)).rows[0].count);

async function freshDatabase() {
  const connectionString = await resetTestDatabase();
  await migrate({ connectionString, log: silent });
  return connectionString;
}

describe("npm run import", () => {
  it("loads the Python OOP grades and can be run again without changing anything", async () => {
    const connectionString = await freshDatabase();

    const first = await runImport({ connectionString, log: silent });
    expect(first.assessments).toBe(1);
    expect(first.students).toBe(97);
    expect(first.grades).toBe(97);
    expect(first.skipped).toBe(0);

    const second = await runImport({ connectionString, log: silent });
    expect(second).toEqual({
      cohorts: 0,
      classes: 0,
      assessments: 0,
      students: 0,
      grades: 0,
      skipped: 0,
    });

    expect(await count(connectionString, "grades")).toBe(97);
    // Re-importing identical grades must not fill the journal with changes
    // that did not happen.
    expect(await count(connectionString, "grade_audit")).toBe(97);
  }, 120_000);

  it("attributes the imported grades to the import in the audit journal", async () => {
    const connectionString = await freshDatabase();
    await runImport({ connectionString, log: silent });

    const rows = (
      await query(
        connectionString,
        "select distinct source, changed_by from grade_audit",
      )
    ).rows;

    expect(rows).toEqual([{ source: "import", changed_by: "import" }]);
  }, 120_000);

  it("publishes what it imports and shows it to the student", async () => {
    const connectionString = await freshDatabase();
    await runImport({ connectionString, log: silent });

    expect(await count(connectionString, "student_grades_v")).toBe(97);

    // Archiving the promotion hides every grade, without deleting anything.
    await query(connectionString, "update cohorts set archived_at = now() where entry_year = 2025");
    expect(await count(connectionString, "student_grades_v")).toBe(0);
    expect(await count(connectionString, "grades")).toBe(97);
  }, 120_000);
});
