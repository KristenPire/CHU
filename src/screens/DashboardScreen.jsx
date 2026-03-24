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
    <motion.div
      {...fadeSlide}
      className="min-h-screen p-6 max-w-[720px] mx-auto"
    >
      <motion.button
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLogout}
        className="bg-transparent border border-tm-border text-tm-cyan font-mono text-[13px] cursor-pointer px-3.5 py-1.5 mb-5 tracking-wider"
      >
        [&lt; LOGOUT]
      </motion.button>

      {/* ── Student card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AsciiBox accent="#00d4ff" className="p-6 mb-5">
          <div className="text-tm-dim text-[11px] mb-1">
            ── STUDENT DASHBOARD ──
          </div>

          <div className="flex justify-between items-baseline flex-wrap gap-2 mb-1">
            <div className="text-tm-white text-[20px] font-bold">{name}</div>
            <div className="text-tm-dim text-[12px]">ID: {studentId}</div>
          </div>

          <div className="border-t border-tm-border mt-3 pt-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={classId}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-tm-dim text-[11px] mb-1.5">
                  {classInfo.fullName.toUpperCase()}
                </div>

                {exams.length > 0 ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span
                        className="text-[28px] font-bold"
                        style={{ color: gradeColor(avg) }}
                      >
                        {avg.toFixed(2)}
                      </span>
                      <span className="text-tm-dim text-[16px]"> / 100</span>
                    </div>
                    <ProgressBar percent={avg} width={35} />
                  </>
                ) : (
                  <div className="text-tm-dim text-[13px]">
                    No exams published yet.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </AsciiBox>
      </motion.div>

      {/* ── Tabs ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ClassTabs
          selectedClass={classId}
          onChange={setClassId}
          studentId={studentId}
        />
      </motion.div>

      {/* ── Exam list ── */}
      <div className="text-tm-dim text-[11px] mb-4 text-center">
        ├{"─".repeat(18)} {exams.length} EXAM(S) {"─".repeat(18)}┤
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={classId}
          variants={stagger}
          initial="initial"
          animate="animate"
          exit={{ opacity: 0 }}
        >
          {exams.map(({ exam, student }) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              student={student}
              onClick={() => onSelectExam(exam.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="text-center text-tm-dim text-[11px] py-4">
        ── click an exam for full details ── <BlinkingCursor />
      </div>
    </motion.div>
  );
}
