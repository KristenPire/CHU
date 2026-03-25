import { C } from "../theme";

export function AsciiBox({ children, className = "", accent }) {
  const c = accent || C.border;
  const corner = (pos, char) => (
    <span className="absolute" style={{ ...pos, color: c }}>
      {char}
    </span>
  );
  return (
    <div
      className={`relative ${className}`}
      style={{ border: `1px solid ${c}` }}
    >
      {corner({ top: -1, left: -1 }, "┌")}
      {corner({ top: -1, right: -1 }, "┐")}
      {corner({ bottom: -1, left: -1 }, "└")}
      {corner({ bottom: -1, right: -1 }, "┘")}
      {children}
    </div>
  );
}
