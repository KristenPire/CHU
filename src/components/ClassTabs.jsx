import { motion } from "framer-motion";
import { C } from "../theme";
import { CLASSES, EXAMS, STUDENTS } from "../data";

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
            {/* sliding green underline that animates between active tabs */}
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
