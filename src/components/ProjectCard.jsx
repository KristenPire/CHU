import { useState } from "react";
import { motion } from "framer-motion";
import { C, staggerItem } from "../theme";
import { AsciiBox } from "./AsciiBox";

export function ProjectCard({ project, group, studentId, hasReport, onViewReport }) {
  const [hovered, setHovered] = useState(false);
  const hasGrade    = group.grade != null;
  const hasComments = group.comments != null;

  return (
    <motion.div variants={staggerItem}>
      <motion.div
        whileHover={hasReport ? { x: 4 } : {}}
        onHoverStart={hasReport ? () => setHovered(true) : undefined}
        onHoverEnd={hasReport ? () => setHovered(false) : undefined}
        transition={{ duration: 0.15 }}
      >
        <AsciiBox
          className={`mb-3 ${hasReport ? "cursor-pointer" : ""}`}
          accent={hasReport && hovered ? C.yellow : undefined}
        >
          <div onClick={hasReport ? onViewReport : undefined}>

            <div className="p-3 sm:p-5 pb-0">

              {/* Title + coeff */}
              <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                <span className="text-tm-white text-[15px] font-bold">{project.title}</span>
                <span className="text-tm-dim text-[11px]">{project.coeff}%</span>
              </div>

              {/* Group badge + status */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className="text-[11px] px-2 py-0.5 tracking-wider font-bold border"
                  style={{ color: C.yellow, borderColor: C.yellow }}
                >
                  {group.groupName}
                </span>
                <span className="text-[11px] tracking-wider" style={{ color: C.green }}>
                  ✓ REGISTERED
                </span>
                {hasGrade && (
                  <span className="text-[11px] tracking-wider" style={{ color: C.cyan }}>
                    ● GRADED
                  </span>
                )}
              </div>

              {/* Dates + repo */}
              <div className="mb-4">
                <div className="text-tm-dim text-[11px] mb-1">
                  start {project.startDate} ── deadline {project.deadline}
                </div>
                {group.repositoryLink && (
                  <a
                    href={group.repositoryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] tracking-wider break-all"
                    style={{ color: C.cyan }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ⬡ {group.repositoryLink}
                  </a>
                )}
              </div>

              {/* Members */}
              <div className="mb-4">
                <div className="text-tm-dim text-[10px] tracking-widest mb-1.5">MEMBERS</div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(group.members).map(([id]) => (
                    <span
                      key={id}
                      className="text-[11px] px-2 py-0.5 border"
                      style={
                        id === studentId
                          ? { color: C.cyan, borderColor: C.cyan }
                          : { color: C.textDim, borderColor: C.border }
                      }
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>

              {/* Grade + comments */}
              <div className="border-t pt-3 mb-4" style={{ borderColor: C.border }}>
                {hasGrade ? (
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[22px] font-bold" style={{ color: C.green }}>
                      {group.grade}
                    </span>
                    <span className="text-tm-dim text-[14px]"> / {project.totalPoints}</span>
                  </div>
                ) : (
                  <div className="text-tm-dim text-[12px] tracking-wider mb-2">
                    GRADE PENDING
                  </div>
                )}
                {hasComments && (
                  <div
                    className="text-[12px] italic pl-3 border-l-2"
                    style={{ color: C.text, borderColor: C.yellow }}
                  >
                    {group.comments}
                  </div>
                )}
              </div>

            </div>

            {/* Report CTA — only when a report exists */}
            {hasReport && (
              <div
                className="px-3 sm:px-5 py-3 flex items-center justify-between border-t transition-colors duration-200"
                style={{
                  borderColor: hovered ? C.yellowDim : C.border,
                  background: hovered ? "rgba(255,215,0,0.06)" : "rgba(255,215,0,0.02)",
                }}
              >
                <span
                  className="text-[12px] tracking-wider font-bold"
                  style={{ color: C.yellow }}
                >
                  view correction &amp; report
                </span>
                <motion.span
                  style={{ color: C.yellow, fontSize: 16 }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </div>
            )}

          </div>
        </AsciiBox>
      </motion.div>
    </motion.div>
  );
}
