/**
 * Project report — full markdown report for a group project.
 * Mirrors the structure of ExamDetailScreen.
 */

import { motion } from "framer-motion";
import { C, fadeSlide } from "../theme";
import { AsciiBox, BlinkingCursor } from "../components";
import { PROJECTS, PROJECT_GROUPS, PROJECT_REPORTS } from "../data";
import { Md } from "../Md";

export function ProjectReportScreen({ projectId, groupName, studentId, onBack }) {
  const project = PROJECTS.find((p) => p.id === projectId);
  const groups  = PROJECT_GROUPS[projectId] || [];
  const group   = groups.find((g) => g.groupName === groupName);
  const report  = PROJECT_REPORTS[projectId]?.[groupName];

  return (
    <motion.div {...fadeSlide} className="min-h-screen p-4 sm:p-6 max-w-[720px] mx-auto">

      <BackButton onBack={onBack} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <ReportHeader project={project} group={group} studentId={studentId} />
      </motion.div>

      <SectionDivider label="PROJECT REPORT" />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <AsciiBox accent={C.yellow} className="mb-3">
          <div className="p-4 sm:p-5 text-[13px] leading-relaxed">
            <Md>{report}</Md>
          </div>
        </AsciiBox>
      </motion.div>

      <div className="text-center text-tm-dim text-[11px] py-6">
        ── end of project report ── <BlinkingCursor />
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

function ReportHeader({ project, group, studentId }) {
  const hasGrade = group?.grade != null;

  return (
    <AsciiBox accent={C.yellow} className="p-4 sm:p-6 mb-5 sm:mb-6">
      <div className="text-tm-dim text-[11px] mb-1">── PROJECT REPORT ──</div>
      <div className="text-tm-white text-[16px] sm:text-[18px] font-bold mb-0.5">{project?.title}</div>
      <div className="text-tm-dim text-[11px] sm:text-[12px] mb-4">
        deadline {project?.deadline} │ {project?.coeff}%
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className="text-[11px] px-2 py-0.5 tracking-wider font-bold border"
          style={{ color: C.yellow, borderColor: C.yellow }}
        >
          {group?.groupName}
        </span>
        {hasGrade && (
          <span className="text-[11px] tracking-wider" style={{ color: C.cyan }}>
            ● GRADED
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {group && Object.entries(group.members).map(([id]) => (
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

      {hasGrade && (
        <div className="border-t pt-3" style={{ borderColor: C.border }}>
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] font-bold" style={{ color: C.green }}>
              {group.grade}
            </span>
            <span className="text-tm-dim text-[14px]"> / {project?.totalPoints}</span>
          </div>
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
