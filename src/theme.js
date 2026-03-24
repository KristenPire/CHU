/**
 * Theme — colors, motion presets, and helpers.
 *
 * Static colors are in index.css (@theme) → use Tailwind classes.
 * The C object here is only for JS-side dynamic coloring
 * (e.g. gradeColor picks green/yellow/red based on score).
 */
// Colors for dynamic JS logic (score-based, status-based)
// Static colors → use Tailwind classes: text-tm-cyan, bg-tm-green, etc.
export const C = {
  green: "#00ff41", greenDim: "#00aa2a",
  red: "#ff3333", redDim: "#aa2222",
  cyan: "#00d4ff", cyanDim: "#0099bb",
  yellow: "#ffd700", text: "#d4d4d4",
  textDim: "#666680", border: "#2a2a4a", white: "#f0f0f0",
};

export const gradeColor = (pct) =>
  pct >= 70 ? C.green : pct >= 50 ? C.yellow : C.red;

// Motion presets
export const fadeSlide = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

export const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const shake = {
  x: [0, -6, 6, -4, 4, 0],
  transition: { duration: 0.4 },
};

// Shorthand for delayed fade-in (used in login sequence)
export const delayedFade = (delay) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration: 0.3 },
});

export const delayedScale = (delay) => ({
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { delay, duration: 0.3 },
});
