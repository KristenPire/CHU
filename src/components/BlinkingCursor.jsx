import { useState } from "react";

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
