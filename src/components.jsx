/**
 * Shared UI components.
 *
 * Primitives: BlinkingCursor, AsciiBox, ProgressBar, Tag
 * Features:   ClassTabs, ExamCard, QuestionCard
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, gradeColor, staggerItem } from "./theme";
import { Md } from "./Md";
import "./hljs-terminal.css";

export { CLASSES, EXAMS, STUDENTS } from "./data";

// ── Primitives ──────────────────────────────────

export function BlinkingCursor() {
  const [on, setOn] = useState(true);
  useState(() => {
    const t = setInterval(() => setOn((v) => !v), 530);
    return () => clearInterval(t);
  });
  return (
    <span
      className="text-tm-cyan transition-opacity"
      style={{ opacity: on ? 1 : 0 }}
    >
      █
    </span>
  );
}

export function AsciiBox({ children, className = "", accent }) {
  const c = accent || C.border;
  const corner = (pos, char) => (
    <span className="absolute" style={{ ...pos, color: c }}>
      {char}
    </span>
  );
  return (
    <div
      className={`relative ${className}`}
      style={{ border: `1px solid ${c}` }}
    >
      {corner({ top: -1, left: -1 }, "┌")}
      {corner({ top: -1, right: -1 }, "┐")}
      {corner({ bottom: -1, left: -1 }, "└")}
      {corner({ bottom: -1, right: -1 }, "┘")}
      {children}
    </div>
  );
}

export function ProgressBar({ percent, width = 30 }) {
  const filled = Math.round((percent / 100) * width);
  const color = gradeColor(percent);
  return (
    <span className="text-[13px]">
      <span className="text-tm-dim">[</span>
      <span style={{ color }}>{"█".repeat(filled)}</span>
      <span className="text-tm-dim">{"░".repeat(width - filled)}</span>
      <span className="text-tm-dim">]</span>
      <span className="ml-2" style={{ color }}>
        {percent.toFixed(2)}
      </span>
    </span>
  );
}

const TAG_CLASSES = {
  ok: "text-[#001a00] bg-tm-green",
  fail: "text-[#1a0000] bg-tm-red",
  partial: "text-[#1a1200] bg-tm-yellow",
  info: "text-tm-cyan bg-transparent border border-tm-cyandim",
  warn: "text-[#1a1200] bg-tm-yellow",
};

export function Tag({ type, children }) {
  return (
    <span
      className={`inline-block px-1.5 py-px text-[11px] font-bold font-mono tracking-wider ${TAG_CLASSES[type] || TAG_CLASSES.info}`}
    >
      {children}
    </span>
  );
}

// ── Class Tabs ──────────────────────────────────

import { CLASSES, EXAMS, STUDENTS } from "./data";

export function ClassTabs({ selectedClass, onChange, studentId }) {
  return (
    <div className="flex mb-5 relative">
      {CLASSES.map((cls) => {
        const active = cls.id === selectedClass;
        const has = EXAMS.some(
          (e) => e.classId === cls.id && STUDENTS[e.id]?.[studentId],
        );
        return (
          <motion.button
            key={cls.id}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(cls.id)}
            className={[
              "flex-1 py-2.5 font-mono text-[13px] font-bold tracking-wider",
              "cursor-pointer relative border-y border-l transition-all duration-200",
              active
                ? "bg-tm-cyan text-tm-bg border-tm-cyan"
                : "bg-transparent text-tm-text border-tm-border",
              !has && "opacity-50",
            ].join(" ")}
          >
            {cls.label}
            {/* layoutId creates the smooth sliding green bar between tabs */}
            {active && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-px left-0 right-0 h-0.5 bg-tm-green"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
      <div
        style={{
          borderRight: `1px solid ${CLASSES.at(-1).id === selectedClass ? C.cyan : C.border}`,
        }}
      />
    </div>
  );
}

// ── Exam Card ───────────────────────────────────

export function ExamCard({ exam, student, onClick }) {
  const pct = (student.grade / exam.totalPoints) * 100;
  const hasDetail = student.wrong !== undefined;

  // Count wrong questions from the wrong map
  const wrongCount = hasDetail ? Object.keys(student.wrong).length : null;
  const totalQ = exam.questions?.length || 0;
  const correctCount = hasDetail ? totalQ - wrongCount : null;

  return (
    <motion.div variants={staggerItem}>
      <motion.div
        whileHover={hasDetail ? { x: 4 } : {}}
        transition={{ duration: 0.15 }}
      >
        <AsciiBox className={`p-5 mb-3 ${hasDetail ? "cursor-pointer" : ""}`}>
          <div onClick={hasDetail ? onClick : undefined}>
            <div className="flex justify-between items-baseline mb-1 flex-wrap gap-2">
              <span className="text-tm-white text-[15px] font-bold">
                {exam.title}
              </span>
              <span className="text-tm-dim text-[11px]">{exam.coeff}%</span>
            </div>

            <div className="text-tm-dim text-[12px] mb-3">
              {exam.date} │ published {exam.publishedDate}
            </div>

            <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
              <div>
                <span
                  className="text-[22px] font-bold"
                  style={{ color: gradeColor(pct) }}
                >
                  {student.grade}
                </span>
                <span className="text-tm-dim text-[14px]">
                  {" "}
                  / {exam.totalPoints}
                </span>
              </div>
              <ProgressBar percent={pct} width={20} />
            </div>

            <div className="flex gap-3 text-[11px] flex-wrap">
              {hasDetail ? (
                <>
                  <span className="text-tm-green">
                    ● {correctCount} correct
                  </span>
                  {wrongCount > 0 && (
                    <span className="text-tm-red">● {wrongCount} wrong</span>
                  )}
                  <span className="text-tm-dim ml-auto">[&gt; DETAILS]</span>
                </>
              ) : (
                <span className="text-tm-dim">grade only</span>
              )}
            </div>
          </div>
        </AsciiBox>
      </motion.div>
    </motion.div>
  );
}

// ── Question Card ───────────────────────────────
// No scoring — just shows right/wrong based on the teacher's "wrong" map

/** Single answer option row */
function OptionRow({ letter, text, isCorrect, isPicked, isWrong }) {
  let bg = "transparent",
    color = C.textDim,
    prefix = "  ",
    suffix = "";

  if (isPicked && isCorrect) {
    bg = "rgba(0,255,65,0.08)";
    color = C.green;
    prefix = "» ";
  } else if (isPicked && isWrong) {
    bg = "rgba(255,51,51,0.08)";
    color = C.red;
    prefix = "» ";
  } else if (isCorrect && !isPicked) {
    color = C.greenDim;
    suffix = " [✓]";
  }

  return (
    <div
      className="py-1.5 px-2.5 text-[13px] flex items-baseline justify-between gap-4"
      style={{
        background: bg,
        color,
        borderLeft: isPicked
          ? `2px solid ${isCorrect ? C.green : C.red}`
          : "2px solid transparent",
      }}
    >
      <span>
        {prefix}{letter}. <Md>{text}</Md>{suffix}
      </span>
      {isPicked && (
        <span
          className="text-[11px] font-mono shrink-0 tracking-wider"
          style={{ color: isWrong ? C.redDim : C.greenDim }}
        >
          your pick
        </span>
      )}
    </div>
  );
}

export function QuestionCard({ question, wrongAnswer, index }) {
  const [showWhy, setShowWhy] = useState(false);

  // wrongAnswer = what the student picked (string like "A" or "ABC"), or undefined if correct
  // "x" means the student did not answer at all
  const isWrongQuestion = wrongAnswer !== undefined;
  const isNoAnswer = isWrongQuestion && wrongAnswer === "x";
  const picked = isWrongQuestion ? (isNoAnswer ? [] : wrongAnswer.split("")) : question.correct;
  const accent = isWrongQuestion ? (isNoAnswer ? C.yellowDim : C.redDim) : C.greenDim;
  const isEitherOr = question.mode === "any" && question.correct.length > 1;

  return (
    <motion.div variants={staggerItem}>
      <AsciiBox accent={accent} className="p-5 mb-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-tm-cyan text-[12px]">
              Q{String(index + 1).padStart(2, "0")}
            </span>
            <Tag type={isNoAnswer ? "warn" : isWrongQuestion ? "fail" : "ok"}>
              {isNoAnswer ? "NO ANSWER" : isWrongQuestion ? "WRONG" : "OK"}
            </Tag>
            {question.mode === "all" && <Tag type="info">SELECT ALL</Tag>}
            {isEitherOr && <Tag type="info">{question.correct.join("/")}</Tag>}
          </div>
        </div>

        {/* Question */}
        <div className="text-tm-white mb-4 text-[14px] leading-relaxed">
          <Md>{question.text}</Md>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-1.5">
          {Object.entries(question.options).map(([letter, text]) => {
            const isCorrect = question.correct.includes(letter);
            const studentPicked = picked.includes(letter);
            return (
              <OptionRow
                key={letter}
                letter={letter}
                text={text}
                isCorrect={isCorrect}
                isPicked={studentPicked}
                isWrong={isWrongQuestion && studentPicked && !isCorrect}
              />
            );
          })}
        </div>

        {/* Explanation */}
        <div className="mt-3.5 pt-2.5 border-t border-tm-border">
          <motion.button
            whileHover={{ x: 2 }}
            onClick={() => setShowWhy(!showWhy)}
            className="bg-transparent border-none text-tm-cyan font-mono text-[12px] cursor-pointer p-0 tracking-wider"
          >
            {showWhy ? "[▼ WHY]" : "[▶ WHY]"} ── explanation
          </motion.button>

          <AnimatePresence>
            {showWhy && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  className="mt-2.5 p-3 text-tm-text text-[13px] leading-relaxed border-l-2 border-tm-cyandim"
                  style={{ background: "rgba(0,212,255,0.04)" }}
                >
                  <Md>{question.explanation}</Md>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AsciiBox>
    </motion.div>
  );
}
