import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, staggerItem } from "../theme";
import { AsciiBox } from "./AsciiBox";
import { Tag } from "./Tag";
import { Md } from "../Md";

export function QuestionCard({ question, wrongAnswer, correctionOnly, index }) {
  const [showWhy, setShowWhy] = useState(false);

  // wrongAnswer = what the student picked (e.g. "A" or "ABC"), undefined if correct, "x" if no answer
  const hasAnswerData = !correctionOnly && wrongAnswer !== undefined;
  const isNoAnswer = hasAnswerData && wrongAnswer === "x";

  // For multi-answer questions, treat as correct if same set of letters regardless of order
  const isActuallyCorrect = hasAnswerData && !isNoAnswer &&
    wrongAnswer.split("").sort().join("") === question.correct.slice().sort().join("");

  const isWrongQuestion = hasAnswerData && !isActuallyCorrect;
  const picked = correctionOnly
    ? []
    : isWrongQuestion
      ? isNoAnswer
        ? []
        : wrongAnswer.split("")
      : question.correct;
  const accent = correctionOnly
    ? C.cyanDim
    : isWrongQuestion
      ? isNoAnswer
        ? C.yellowDim
        : C.redDim
      : C.greenDim;
  const isEitherOr = question.mode === "any" && question.correct.length > 1;

  return (
    <motion.div variants={staggerItem}>
      <AsciiBox accent={accent} className="p-3 sm:p-5 mb-4">
        <QuestionHeader
          index={index}
          isNoAnswer={isNoAnswer}
          isWrongQuestion={isWrongQuestion}
          correctionOnly={correctionOnly}
          question={question}
          isEitherOr={isEitherOr}
        />

        <QuestionText question={question} />

        <OptionList
          question={question}
          picked={picked}
          isWrongQuestion={isWrongQuestion}
          correctionOnly={correctionOnly}
        />

        <Explanation
          showWhy={showWhy}
          onToggle={() => setShowWhy(!showWhy)}
          question={question}
        />
      </AsciiBox>
    </motion.div>
  );
}

function QuestionHeader({
  index,
  isNoAnswer,
  isWrongQuestion,
  correctionOnly,
  question,
  isEitherOr,
}) {
  return (
    <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <span className="text-tm-cyan text-[12px]">
          Q{String(index + 1).padStart(2, "0")}
        </span>
        {!correctionOnly && (
          <Tag type={isNoAnswer ? "warn" : isWrongQuestion ? "fail" : "ok"}>
            {isNoAnswer ? "NO ANSWER" : isWrongQuestion ? "WRONG" : "OK"}
          </Tag>
        )}
        {question.mode === "all" && <Tag type="info">SELECT ALL</Tag>}
        {isEitherOr && <Tag type="info">{question.correct.join(" or ")}</Tag>}
      </div>
    </div>
  );
}

function QuestionText({ question }) {
  return (
    <div className="text-tm-white mb-4 text-[14px] leading-relaxed">
      <Md>{question.text}</Md>
    </div>
  );
}

function OptionList({ question, picked, isWrongQuestion, correctionOnly }) {
  return (
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
            isPicked={correctionOnly ? false : studentPicked}
            isWrong={!correctionOnly && isWrongQuestion && studentPicked && !isCorrect}
            correctionOnly={correctionOnly}
          />
        );
      })}
    </div>
  );
}

function OptionRow({ letter, text, isCorrect, isPicked, isWrong, correctionOnly }) {
  let bg = "transparent",
    color = C.textDim,
    prefix = "  ",
    suffix = "",
    borderColor = "transparent";

  if (correctionOnly && isCorrect) {
    bg = "rgba(0,255,65,0.08)";
    color = C.green;
    prefix = "» ";
    borderColor = C.green;
    suffix = " [✓]";
  } else if (isPicked && isCorrect) {
    bg = "rgba(0,255,65,0.08)";
    color = C.green;
    prefix = "» ";
    borderColor = C.green;
  } else if (isPicked && isWrong) {
    bg = "rgba(255,51,51,0.08)";
    color = C.red;
    prefix = "» ";
    borderColor = C.red;
  } else if (isCorrect && !isPicked) {
    color = C.greenDim;
    suffix = " [✓]";
  }

  return (
    <div
      className="py-1.5 px-1.5 sm:px-2.5 text-[12px] sm:text-[13px] flex items-baseline justify-between gap-2 sm:gap-4"
      style={{
        background: bg,
        color,
        borderLeft: `2px solid ${borderColor}`,
      }}
    >
      <span>
        {prefix}
        {letter}. <Md>{text}</Md>
        {suffix}
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

function Explanation({ showWhy, onToggle, question }) {
  return (
    <div className="mt-3.5 pt-2.5 border-t border-tm-border">
      <motion.button
        whileHover={{ x: 2 }}
        onClick={onToggle}
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
  );
}
