/**
 * App root — minimal screen router.
 *
 * Three screens, no react-router needed.
 * AnimatePresence handles fade transitions between them.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginScreen } from "./screens/LoginScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { ExamDetailScreen } from "./screens/ExamDetailScreen";
import { ProjectReportScreen } from "./screens/ProjectReportScreen";
export default function App() {
  const [screen, setScreen] = useState("login");
  const [studentId, setStudentId] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null); // { projectId, groupName }

  return (
    <div className="bg-tm-bg text-tm-text font-mono min-h-screen text-[14px] overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === "login" && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
            <LoginScreen onLogin={(id) => { setStudentId(id); setScreen("dashboard"); }} />
          </motion.div>
        )}
        {screen === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <DashboardScreen
              studentId={studentId}
              onSelectExam={(eid) => { setSelectedExam(eid); setScreen("detail"); }}
              onSelectProject={(projectId, groupName) => { setSelectedProject({ projectId, groupName }); setScreen("report"); }}
              onLogout={() => { setStudentId(null); setScreen("login"); }}
            />
          </motion.div>
        )}
        {screen === "detail" && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <ExamDetailScreen examId={selectedExam} studentId={studentId} onBack={() => setScreen("dashboard")} />
          </motion.div>
        )}
        {screen === "report" && selectedProject && (
          <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <ProjectReportScreen
              projectId={selectedProject.projectId}
              groupName={selectedProject.groupName}
              studentId={studentId}
              onBack={() => setScreen("dashboard")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
