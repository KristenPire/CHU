import { gradeColor } from "../theme";

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
