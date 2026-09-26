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
  ProjectCard,
} from "../components";
import {
  getStudentExams,
  getStudentProjects,
  getDefaultClassId,
  computeWeightedAverage,
  PROJECT_REPORTS,
} from "../data";

export function DashboardScreen({ studentId, onSelectExam, onSelectProject, onLogout }) {
  const [classId, setClassId] = useState(() => getDefaultClassId(studentId));

  const exams = useMemo(
    () => getStudentExams(studentId, classId),
    [studentId, classId],
  );
  const projects = useMemo(
    () => getStudentProjects(studentId, classId),
    [studentId, classId],
  );

  // Merge exams and projects into one list, sorted by date descending
  const items = useMemo(() => {
    const all = [
      ...exams.map((e) => ({ kind: "exam", date: e.exam.publishedDate, ...e })),
      ...projects.map((p) => ({ kind: "project", date: p.project.publishedDate ?? p.project.deadline, ...p })),
    ];
    return all.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
  }, [exams, projects]);

  const avg = computeWeightedAverage(exams, projects);
  const totalCoeff = exams.reduce((s, e) => s + e.exam.coeff, 0)
                   + projects.reduce((s, p) => s + p.project.coeff, 0);
  const classInfo = CLASSES.find((c) => c.id === classId);

  return (
    <motion.div {...fadeSlide} className="min-h-screen p-4 sm:p-6 max-w-[720px] mx-auto">

      <LogoutButton onLogout={onLogout} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <IdentityCard studentId={studentId} />
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
          <GradeSummary exams={exams} projects={projects} avg={avg} totalCoeff={totalCoeff} classInfo={classInfo} />
        </motion.div>
      </AnimatePresence>

      {items.length > 0 && <SectionDivider label="EXAMS" />}

      <AnimatePresence mode="wait">
        <motion.div
          key={classId}
          variants={stagger}
          initial="initial"
          animate="animate"
          exit={{ opacity: 0 }}
        >
          {items.map((item, i) =>
            item.kind === "exam" ? (
              <ExamCard
                key={item.exam.id}
                exam={item.exam}
                student={item.student}
                isLatest={i === 0}
                onClick={() => onSelectExam(item.exam.id)}
              />
            ) : (
              <ProjectCard
                key={item.project.id + item.group.groupName}
                project={item.project}
                group={item.group}
                studentId={studentId}
                hasReport={!!PROJECT_REPORTS[item.project.id]?.[item.group.groupName]}
                onViewReport={() => onSelectProject(item.project.id, item.group.groupName)}
              />
            )
          )}
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

function IdentityCard({ studentId }) {
  return (
    <AsciiBox accent="#00d4ff" className="p-3 sm:p-4 mb-5">
      <div className="text-tm-white text-[16px] sm:text-[18px] font-bold">ID: {studentId}</div>
    </AsciiBox>
  );
}

function GradeSummary({ exams, projects, avg, totalCoeff, classInfo }) {
  const gradedProjects = projects.filter(({ group }) => group.grade != null);
  const hasGradedItems = exams.length > 0 || gradedProjects.length > 0;

  if (!hasGradedItems) {
    const hasPendingProjects = projects.length > 0;
    return (
      <AsciiBox className="p-5">
        <div className="text-tm-dim text-[13px]">
          {hasPendingProjects
            ? "Project registered — grade pending."
            : "No exams published yet."}
        </div>
      </AsciiBox>
    );
  }

  const formulaParts = [
    ...exams.map(({ exam }) => `${exam.title} × ${exam.coeff}%`),
    ...gradedProjects.map(({ project }) => `${project.title} × ${project.coeff}%`),
  ];

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
        {formulaParts.join("  +  ")}
      </div>
      {totalCoeff < 100 && (
        <div className="text-tm-dim text-[10px] mt-2 tracking-wider">
          {100 - totalCoeff}% remaining ── more to come
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
