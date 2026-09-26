/**
 * Login screen — terminal-style student ID prompt.
 *
 * The input is hidden off-screen; visible text + blinking cursor
 * are rendered manually for the authentic terminal look.
 * Shake animation triggers on wrong ID.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scaleIn, shake, delayedFade, delayedScale } from "../theme";
import { BlinkingCursor } from "../components";
import { fetchStudent } from "../api/client";

export function LoginScreen({ onLogin }) {
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const inputRef = { current: null };

  // Checking a number used to be a lookup in a table the browser already had.
  // It is now a request, so it can be slow and it can fail — and an unknown
  // number and an unreachable server must not read the same to a student.
  const submit = async () => {
    const id = studentId.trim();
    setError(null);
    if (!id || busy) return;

    setBusy(true);
    try {
      const student = await fetchStudent(id);
      onLogin(student);
    } catch (failure) {
      setError(
        failure?.kind === "notFound"
          ? { kind: "notFound", id }
          : { kind: "unreachable" },
      );
      if (failure?.kind === "notFound") setStudentId("");
      setShakeKey((k) => k + 1);
    } finally {
      setBusy(false);
    }
  };

  const focus = () => inputRef.current?.focus();

  return (
    <div className="min-h-screen flex items-center justify-center p-4" onClick={focus}>
      <motion.div {...scaleIn} className="w-full max-w-[600px] border-[1.5px] border-tm-cyan bg-tm-bg">

        <TitleBar />

        <div className="pt-6 pb-5 px-4 sm:pt-8 sm:pb-6 sm:px-6">
          <SchoolHeader />
          <IdPrompt
            studentId={studentId}
            error={error}
            busy={busy}
            shakeKey={shakeKey}
            inputRef={inputRef}
            onSubmit={submit}
            onFocus={focus}
            onChange={(val) => { setStudentId(val); setError(null); }}
          />
        </div>

      </motion.div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────

function TitleBar() {
  return (
    <div className="flex items-center justify-between px-3.5 py-2 border-b border-tm-border">
      <div className="text-[11px]">
        <span className="text-tm-green opacity-70">user@exam-server:~$</span>
        <span className="text-tm-dim ml-3">./results --view</span>
      </div>
      <div className="flex gap-1.5">
        {["tm-green", "tm-yellow", "tm-red"].map((c) => (
          <span key={c} className={`w-2.5 h-2.5 rounded-full bg-${c} opacity-60`} />
        ))}
      </div>
    </div>
  );
}

function SchoolHeader() {
  return (
    <>
      <motion.div {...delayedFade(0.2)} className="text-center mb-2">
        <div className="text-[24px] sm:text-[28px] font-bold text-tm-cyan tracking-[3px]">EPITA</div>
        <div className="text-[13px] text-tm-dim tracking-[4px] my-1">×</div>
        <div className="text-[15px] sm:text-[20px] font-bold text-tm-cyan tracking-[1px] sm:tracking-[2px]">CHANG'AN UNIVERSITY</div>
      </motion.div>

      <motion.div {...delayedScale(0.4)} className="text-center text-tm-border text-[12px] my-4 origin-center overflow-hidden">
        {"─".repeat(40)}
      </motion.div>

      <motion.div {...delayedFade(0.5)} className="text-center text-[11px] sm:text-[13px] text-tm-green tracking-[3px] sm:tracking-[6px] mb-6">
        EXAM RESULTS VIEWER
      </motion.div>

      <motion.div {...delayedScale(0.6)} className="text-center text-tm-border text-[12px] mb-6 origin-center overflow-hidden">
        {"─".repeat(40)}
      </motion.div>
    </>
  );
}

function IdPrompt({ studentId, error, busy, shakeKey, inputRef, onSubmit, onFocus, onChange }) {
  return (
    <motion.div {...delayedFade(0.7)}>
      <div className="text-tm-text mb-3 text-[13px]">Enter your student ID:</div>

      <TerminalInput
        studentId={studentId}
        error={error}
        shakeKey={shakeKey}
        inputRef={inputRef}
        onSubmit={onSubmit}
        onFocus={onFocus}
        onChange={onChange}
      />

      <StatusLine error={error} busy={busy} />

      <div className="flex justify-end">
        <SubmitButton onSubmit={onSubmit} busy={busy} />
      </div>
    </motion.div>
  );
}

function TerminalInput({ studentId, error, shakeKey, inputRef, onSubmit, onFocus, onChange }) {
  return (
    <motion.div
      key={shakeKey}
      animate={error ? shake : {}}
      className="flex items-center cursor-text overflow-hidden"
      onClick={onFocus}
    >
      <span className="text-tm-green whitespace-nowrap text-[12px] sm:text-[14px]">student@exam</span>
      <span className="text-tm-dim text-[12px] sm:text-[14px]">:~$ </span>
      <span className="text-tm-white">{studentId}</span>
      <BlinkingCursor />
      <input
        ref={(el) => { inputRef.current = el; el?.focus(); }}
        type="text" inputMode="numeric" autoFocus
        value={studentId}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        className="fixed top-0 left-0 opacity-0 w-px h-px pointer-events-none"
      />
    </motion.div>
  );
}

/**
 * One line for the three things that can now happen: a request is in flight, a
 * number is unknown, or the server did not answer. Telling the last two apart
 * matters — one is the student's mistake, the other is not.
 */
function StatusLine({ error, busy }) {
  return (
    <div className="h-5 mt-2 text-[12px]">
      <AnimatePresence mode="wait">
        {busy && (
          <motion.span key="busy" className="text-tm-dim"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            checking…
          </motion.span>
        )}
        {!busy && error?.kind === "notFound" && (
          <motion.span key="notFound" className="text-tm-red"
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            -bash: student '{error.id}': not found
          </motion.span>
        )}
        {!busy && error?.kind === "unreachable" && (
          <motion.span key="unreachable" className="text-tm-yellow"
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            -bash: server unreachable — try again
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubmitButton({ onSubmit, busy }) {
  return (
    <motion.button
      whileHover={busy ? {} : { scale: 1.05 }}
      whileTap={busy ? {} : { scale: 0.95 }}
      onClick={onSubmit}
      disabled={busy}
      className={`bg-transparent text-tm-cyan border border-tm-border font-mono text-[11px] px-3.5 py-1 tracking-wider ${busy ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
    >
      [enter]
    </motion.button>
  );
}
