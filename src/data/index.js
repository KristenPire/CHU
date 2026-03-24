/**
 * Auto-discovers all exam folders using Vite's glob import.
 * Adding a new exam = create data/<class>/<number>/ with 3 JSON files.
 */

import CLASSES_JSON from "./classes.json";

const infoFiles = import.meta.glob("./*/*/info.json", { eager: true });
const bodyFiles = import.meta.glob("./*/*/body.json", { eager: true });
const studentFiles = import.meta.glob("./*/*/students.json", { eager: true });

export const CLASSES = CLASSES_JSON;

function loadAll() {
  const exams = [];
  const students = {};

  for (const [path, info] of Object.entries(infoFiles)) {
    const [, classId, num] = path.split("/");
    const examId = `${classId}-${num}`;

    const body = bodyFiles[`./${classId}/${num}/body.json`]?.default;
    const studentData = studentFiles[`./${classId}/${num}/students.json`]?.default;
    if (!body || !studentData) continue;

    exams.push({
      id: examId,
      classId,
      num,
      ...info.default,
      bodyType: body.bodyType,
      questions: body.questions,
    });

    // Pass student data through as-is. Grade is provided by the teacher.
    // "wrong" is optional — only used for question-level display.
    students[examId] = studentData;
  }

  exams.sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
  return { exams, students };
}

const data = loadAll();
export const EXAMS = data.exams;
export const STUDENTS = data.students;

// ── Helpers ─────────────────────────────────────

/** Get all exams for a student in a class, with their grade */
export function getStudentExams(studentId, classId) {
  const results = [];
  for (const exam of EXAMS) {
    if (exam.classId !== classId) continue;
    const student = STUDENTS[exam.id]?.[studentId];
    if (student) results.push({ exam, student });
  }
  return results;
}

export function getStudentName(studentId) {
  for (const exam of EXAMS) {
    const s = STUDENTS[exam.id]?.[studentId];
    if (s) return s.name;
  }
  return null;
}

export function studentExists(studentId) {
  return EXAMS.some((e) => STUDENTS[e.id]?.[studentId]);
}

/** Default tab = class with most recently published exam for this student */
export function getDefaultClassId(studentId) {
  let latest = null, result = CLASSES[0].id;
  for (const exam of EXAMS) {
    if (!STUDENTS[exam.id]?.[studentId]) continue;
    if (!latest || exam.publishedDate > latest) {
      latest = exam.publishedDate;
      result = exam.classId;
    }
  }
  return result;
}

/** Weighted average: sum(grade × coeff%) / sum(coeff%) */
export function computeWeightedAverage(examResults) {
  let sumWeighted = 0, sumCoeff = 0;
  for (const { exam, student } of examResults) {
    const normalized = (student.grade / exam.totalPoints) * 100;
    sumWeighted += normalized * exam.coeff;
    sumCoeff += exam.coeff;
  }
  return sumCoeff > 0 ? Math.round((sumWeighted / sumCoeff) * 100) / 100 : 0;
}
