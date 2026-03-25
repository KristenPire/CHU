const TAG_CLASSES = {
  ok:      "text-[#001a00] bg-tm-green",
  fail:    "text-[#1a0000] bg-tm-red",
  partial: "text-[#1a1200] bg-tm-yellow",
  info:    "text-tm-cyan bg-transparent border border-tm-cyandim",
  warn:    "text-[#1a1200] bg-tm-yellow",
};

export function Tag({ type, children }) {
  return (
    <span
      className={`inline-block px-1.5 py-px text-[11px] font-bold font-mono tracking-wider ${TAG_CLASSES[type] || TAG_CLASSES.info}`}
    >
      {children}
    </span>
  );
}
