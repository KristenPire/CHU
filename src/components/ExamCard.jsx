import { useState } from "react";
import { motion } from "framer-motion";
import { C, gradeColor, staggerItem } from "../theme";
import { AsciiBox } from "./AsciiBox";
import { ProgressBar } from "./ProgressBar";

export function ExamCard({ exam, student, onClick, isLatest }) {
  const [hovered, setHovered] = useState(false);
  const pct = (student.grade / exam.totalPoints) * 100;
  const hasAnswers = student.wrong !== undefined;
  const hasBody = exam.questions?.length > 0;
  const hasDetail = hasAnswers || hasBody;

  const wrongCount = hasAnswers ? Object.keys(student.wrong).length : null;
  const totalQ = exam.questions?.length || 0;
  const correctCount = hasAnswers ? totalQ - wrongCount : null;

  const nudge = isLatest && hasDetail;

  return (
    <motion.div
      variants={staggerItem}
      animate={
        nudge
          ? {
              x: [0, 6, -6, 0, 0, 0],
              boxShadow: "0 0 18px rgba(0,212,255,0.3)",
            }
          : {}
      }
      transition={
        nudge
          ? {
              x: { repeat: Infinity, duration: 3, times: [0, 0.06, 0.14, 0.22, 0.5, 1], ease: "easeOut" },
              boxShadow: { duration: 0 },
            }
          : {}
      }
    >
      <motion.div
        whileHover={hasDetail ? { x: 4 } : {}}
        onHoverStart={hasDetail ? () => setHovered(true) : undefined}
        onHoverEnd={hasDetail ? () => setHovered(false) : undefined}
        transition={{ duration: 0.15 }}
      >
        <AsciiBox
          className={`mb-3 ${hasDetail ? "cursor-pointer" : "p-3 sm:p-5"}`}
          accent={hasDetail && hovered ? C.cyan : undefined}
        >
          <div onClick={hasDetail ? onClick : undefined}>

            <ExamCardBody
              exam={exam}
              student={student}
              pct={pct}
              hasDetail={hasDetail}
              hasAnswers={hasAnswers}
              correctCount={correctCount}
            />

            {hasDetail && (
              <ReviewCallToAction
                wrongCount={wrongCount}
                hasAnswers={hasAnswers}
                hovered={hovered}
              />
            )}

          </div>
        </AsciiBox>
      </motion.div>
    </motion.div>
  );
}

function ExamCardBody({ exam, student, pct, hasDetail, hasAnswers, correctCount }) {
  return (
    <div className="p-3 sm:p-5 pb-0">

      <div className="flex justify-between items-baseline mb-1 flex-wrap gap-2">
        <span className="text-tm-white text-[15px] font-bold">{exam.title}</span>
        <span className="text-tm-dim text-[11px]">{exam.coeff}%</span>
      </div>

      <div className="text-tm-dim text-[12px] mb-3">
        {exam.date} │ published {exam.publishedDate}
      </div>

      <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
        <GradeDisplay student={student} pct={pct} exam={exam} />
        <span className="overflow-hidden">
          <ProgressBar percent={pct} width={15} />
        </span>
      </div>

      <div className="flex gap-3 text-[11px] flex-wrap mb-4">
        {hasAnswers ? (
          <span className="text-tm-green">● {correctCount} correct</span>
        ) : hasDetail ? (
          <span className="text-tm-cyan">● correction available</span>
        ) : (
          <span className="text-tm-dim">grade only</span>
        )}
      </div>

    </div>
  );
}

function GradeDisplay({ student, pct, exam }) {
  return (
    <div>
      <span
        className="text-[22px] font-bold"
        style={{ color: gradeColor(pct) }}
      >
        {student.grade}
      </span>
      <span className="text-tm-dim text-[14px]"> / {exam.totalPoints}</span>
    </div>
  );
}

function ReviewCallToAction({ wrongCount, hasAnswers, hovered }) {
  const label = !hasAnswers
    ? "view correction & explanations"
    : wrongCount > 0
      ? `${wrongCount} question${wrongCount > 1 ? "s" : ""} to review`
      : "perfect score — see explanations";

  return (
    <div
      className="px-3 sm:px-5 py-3 flex items-center justify-between border-t transition-colors duration-200"
      style={{
        borderColor: hovered ? C.cyanDim : C.border,
        background: hovered ? "rgba(0,212,255,0.06)" : "rgba(0,212,255,0.02)",
      }}
    >
      <span
        className="text-[12px] tracking-wider font-bold"
        style={{ color: !hasAnswers ? C.cyan : wrongCount > 0 ? C.cyan : C.green }}
      >
        {label}
      </span>
      <motion.span
        className="text-tm-cyan text-[16px]"
        animate={{ x: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        →
      </motion.span>
    </div>
  );
}
