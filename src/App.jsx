/**
 * App root — minimal screen router.
 *
 * Four screens, no react-router needed.
 * AnimatePresence handles fade transitions between them.
 *
 * The student's results are fetched once, here, when they log in: every screen
 * below reads from that one payload instead of from data bundled into the
 * JavaScript. Only an exam body or a correction report is fetched later, by the
 * screen that opens it.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginScreen } from "./screens/LoginScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { ExamDetailScreen } from "./screens/ExamDetailScreen";
import { ProjectReportScreen } from "./screens/ProjectReportScreen";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [student, setStudent] = useState(null);
  const [assessmentId, setAssessmentId] = useState(null);

  const studentId = student?.studentId ?? null;

  return (
    <div className="bg-tm-bg text-tm-text font-mono min-h-screen text-[14px] overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === "login" && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
            {/* The login screen loads the student, so the dashboard opens on
                data that is already there rather than on a spinner. */}
            <LoginScreen onLogin={(loaded) => { setStudent(loaded); setScreen("dashboard"); }} />
          </motion.div>
        )}
        {screen === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <DashboardScreen
              student={student}
              onSelectExam={(id) => { setAssessmentId(id); setScreen("detail"); }}
              onSelectProject={(id) => { setAssessmentId(id); setScreen("report"); }}
              onLogout={() => { setStudent(null); setScreen("login"); }}
            />
          </motion.div>
        )}
        {screen === "detail" && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <ExamDetailScreen assessmentId={assessmentId} studentId={studentId} onBack={() => setScreen("dashboard")} />
          </motion.div>
        )}
        {screen === "report" && (
          <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <ProjectReportScreen assessmentId={assessmentId} studentId={studentId} onBack={() => setScreen("dashboard")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
