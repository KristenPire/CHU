/**
 * Exam detail — question-by-question review.
 * No scoring — grade comes from the teacher, "wrong" map is for display only.
 */

import { motion } from "framer-motion";
import { C, gradeColor, fadeSlide, stagger } from "../theme";
import { EXAMS, STUDENTS, AsciiBox, BlinkingCursor, ProgressBar, QuestionCard } from "../components";

export function ExamDetailScreen({ examId, studentId, onBack }) {
  const exam = EXAMS.find((e) => e.id === examId);
  const student = STUDENTS[examId][studentId];
  const pct = (student.grade / exam.totalPoints) * 100;
  const label = pct >= 90 ? "EXCELLENT" : pct >= 70 ? "GOOD" : "";

  const wrong = student.wrong || {};
  const wrongCount = Object.keys(wrong).length;
  const correctCount = exam.questions.length - wrongCount;

  return (
    <motion.div {...fadeSlide} className="min-h-screen p-4 sm:p-6 max-w-[720px] mx-auto">

      <BackButton onBack={onBack} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <ScoreHeader
          exam={exam}
          student={student}
          studentId={studentId}
          pct={pct}
          label={label}
          correctCount={correctCount}
          wrongCount={wrongCount}
        />
      </motion.div>

      <SectionDivider label="QUESTION DETAILS" />

      <motion.div variants={stagger} initial="initial" animate="animate">
        {exam.questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            wrongAnswer={wrong[String(q.id)]}
            index={i}
          />
        ))}
      </motion.div>

      <div className="text-center text-tm-dim text-[11px] py-6">
        ── end of exam review ── <BlinkingCursor />
      </div>

    </motion.div>
  );
}

// ── Sub-components ───────────────────────────────

function BackButton({ onBack }) {
  return (
    <motion.button
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onBack}
      className="bg-transparent border border-tm-border text-tm-cyan font-mono text-[13px] cursor-pointer px-3.5 py-1.5 mb-5 tracking-wider"
    >
      [&lt; BACK]
    </motion.button>
  );
}

function ScoreHeader({ exam, student, studentId, pct, label, correctCount, wrongCount }) {
  return (
    <AsciiBox accent={C.cyan} className="p-4 sm:p-6 mb-5 sm:mb-6">
      <div className="text-tm-dim text-[11px] mb-1">── EXAM RESULTS ──</div>
      <div className="text-tm-white text-[16px] sm:text-[18px] font-bold mb-0.5">{exam.title}</div>
      <div className="text-tm-dim text-[11px] sm:text-[12px] mb-4">
        {exam.date} │ {exam.coeff}% │ ID: {studentId}
      </div>

      <div className="flex justify-between items-baseline flex-wrap gap-2 mb-2">
        <span className="text-tm-white text-[13px]">
          Student: <span className="text-tm-cyan">{student.name}</span>
        </span>
        {label && (
          <span className="text-[13px] font-bold" style={{ color: gradeColor(pct) }}>
            [{label}]
          </span>
        )}
      </div>

      <div className="mb-3">
        <span className="text-tm-white text-[24px] sm:text-[28px] font-bold">{student.grade}</span>
        <span className="text-tm-dim text-[16px] sm:text-[18px]"> / {exam.totalPoints}</span>
      </div>

      <div className="overflow-hidden">
        <ProgressBar percent={pct} width={25} />
      </div>

      <div className="flex gap-4 mt-4 flex-wrap text-[12px]">
        <span className="text-tm-green">● {correctCount} correct</span>
        {wrongCount > 0 && <span className="text-tm-red">● {wrongCount} wrong</span>}
      </div>
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
