/**
 * The final grade formula.
 *
 * Pure, and deliberately free of any React, Vite or database import: it is the
 * one piece of logic whose result students read off the screen, so it has to be
 * testable on its own and identical wherever it runs — the current front end,
 * the API that will replace it, or a script.
 *
 *   average = Σ((grade / totalPoints) × 100 × coeff) / Σ(coeff)
 *
 * over the student's graded items, exams and projects alike.
 */

/** Weighted average: sum(grade × coeff%) / sum(coeff%) — includes graded projects */
export function computeWeightedAverage(examResults, projectResults = []) {
  let sumWeighted = 0, sumCoeff = 0;
  for (const { exam, student } of examResults) {
    const normalized = (student.grade / exam.totalPoints) * 100;
    sumWeighted += normalized * exam.coeff;
    sumCoeff += exam.coeff;
  }
  for (const { project, group } of projectResults) {
    if (group.grade == null) continue;
    const normalized = (group.grade / project.totalPoints) * 100;
    sumWeighted += normalized * project.coeff;
    sumCoeff += project.coeff;
  }
  return sumCoeff > 0 ? Math.round((sumWeighted / sumCoeff) * 100) / 100 : 0;
}
