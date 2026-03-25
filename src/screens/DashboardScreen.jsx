/**
 * Dashboard — student overview with class-filtered exam list.
 * Default tab = class with most recently published exam.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gradeColor, fadeSlide, stagger } from "../theme";
import {
  CLASSES,
  AsciiBox,
  BlinkingCursor,
  ProgressBar,
  ClassTabs,
  ExamCard,
} from "../components";
import {
  getStudentExams,
  getStudentName,
  getDefaultClassId,
  computeWeightedAverage,
} from "../data";

export function DashboardScreen({ studentId, onSelectExam, onLogout }) {
  const name = getStudentName(studentId);
  const [classId, setClassId] = useState(() => getDefaultClassId(studentId));

  const exams = useMemo(
    () => getStudentExams(studentId, classId),
    [studentId, classId],
  );
  const avg = computeWeightedAverage(exams);
  const totalCoeff = exams.reduce((s, e) => s + e.exam.coeff, 0);
  const classInfo = CLASSES.find((c) => c.id === classId);

  return (
    <motion.div {...fadeSlide} className="min-h-screen p-4 sm:p-6 max-w-[720px] mx-auto">

      <LogoutButton onLogout={onLogout} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <IdentityCard name={name} studentId={studentId} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <ClassTabs selectedClass={classId} onChange={setClassId} studentId={studentId} />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={classId}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="mb-5"
        >
          <GradeSummary exams={exams} avg={avg} totalCoeff={totalCoeff} classInfo={classInfo} />
        </motion.div>
      </AnimatePresence>

      {exams.length > 0 && <SectionDivider label="EXAMS" />}

      <AnimatePresence mode="wait">
        <motion.div
          key={classId}
          variants={stagger}
          initial="initial"
          animate="animate"
          exit={{ opacity: 0 }}
        >
          {exams.map(({ exam, student }, i) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              student={student}
              isLatest={i === 0}
              onClick={() => onSelectExam(exam.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="text-center text-tm-dim text-[11px] py-4">
        ── <BlinkingCursor />
      </div>

    </motion.div>
  );
}

// ── Sub-components ───────────────────────────────

function LogoutButton({ onLogout }) {
  return (
    <motion.button
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onLogout}
      className="bg-transparent border border-tm-border text-tm-cyan font-mono text-[13px] cursor-pointer px-3.5 py-1.5 mb-5 tracking-wider"
    >
      [&lt; LOGOUT]
    </motion.button>
  );
}

function IdentityCard({ name, studentId }) {
  return (
    <AsciiBox accent="#00d4ff" className="p-3 sm:p-4 mb-5">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="text-tm-white text-[16px] sm:text-[18px] font-bold">{name}</div>
        <div className="text-tm-dim text-[12px]">ID: {studentId}</div>
      </div>
    </AsciiBox>
  );
}

function GradeSummary({ exams, avg, totalCoeff, classInfo }) {
  if (exams.length === 0) {
    return (
      <AsciiBox className="p-5">
        <div className="text-tm-dim text-[13px]">No exams published yet.</div>
      </AsciiBox>
    );
  }

  return (
    <AsciiBox accent={gradeColor(avg)} className="p-3 sm:p-5">
      <div className="text-tm-dim text-[10px] tracking-wider mb-2">
        {classInfo.fullName.toUpperCase()} ── FINAL GRADE
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
        <div className="flex items-baseline gap-2">
          <span className="text-[24px] font-bold" style={{ color: gradeColor(avg) }}>
            {avg.toFixed(2)}
          </span>
          <span className="text-tm-dim text-[14px]"> / 100</span>
        </div>
        <span className="overflow-hidden">
          <ProgressBar percent={avg} width={20} />
        </span>
      </div>
      <div className="text-tm-text text-[10px] opacity-40 mt-1">
        {exams.map(({ exam }) => `${exam.title} × ${exam.coeff}%`).join("  +  ")}
      </div>
      {totalCoeff < 100 && (
        <div className="text-tm-dim text-[10px] mt-2 tracking-wider">
          {100 - totalCoeff}% remaining ── more exams to come
        </div>
      )}
    </AsciiBox>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-px bg-tm-border" />
      <span className="text-tm-text text-[12px] tracking-widest font-bold">{label}</span>
      <div className="flex-1 h-px bg-tm-border" />
    </div>
  );
}
