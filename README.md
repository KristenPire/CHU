# Exam Results Viewer

Terminal-themed student exam results viewer built for the EPITA × Chang'an University collaboration.

Three teachers share this site — each manages their own class (`net`, `os`, `fp`). Students log in with their ID, pick a class tab, and review their graded MCQs question by question.

---

## Quick Start

```bash
npm create vite@latest exam-results -- --template react
cd exam-results
npm install
npm install framer-motion
npm install -D tailwindcss @tailwindcss/vite
```

Add Tailwind to `vite.config.js`:
```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Then replace `src/` with this folder and run:
```bash
npm run dev
```

---

## Project Structure

```
src/
│
├── App.jsx                  ← Screen router (login → dashboard → detail)
├── main.jsx                 ← Vite entry point
├── index.css                ← Tailwind import + custom terminal colors
├── theme.js                 ← Color map for JS logic + framer-motion presets

├── components.jsx           ← Every reusable UI component
│
├── screens/
│   ├── LoginScreen.jsx      ← Terminal-style student ID prompt
│   ├── DashboardScreen.jsx  ← Student overview + class tabs + exam list
│   └── ExamDetailScreen.jsx ← Full question-by-question exam review
│
└── data/                    ← PURE DATA — no code, only JSON
    ├── README.md            ← Guide for adding exams (give this to teachers)
    ├── classes.json         ← Class definitions
    ├── index.js             ← Auto-loader (Vite glob, never edit)
    └── <class>/<number>/    ← One folder per exam
        ├── info.json        ← Title, dates, coefficient
        ├── body.json        ← Questions, options, correct answers
        └── students.json    ← Student results (wrong answers only)
```

---

## How It Works

### Screen Flow

```
LoginScreen → DashboardScreen → ExamDetailScreen
                  ↑                    │
                  └────────────────────┘
```

1. **Login** — student enters their ID in a fake terminal prompt
2. **Dashboard** — shows their name, weighted average for the selected class, and a list of exam cards. Class tabs (`Net | OS | FP`) filter everything.
3. **Exam Detail** — question-by-question breakdown with color-coded answers and expandable explanations

### Data Loading

`data/index.js` uses Vite's `import.meta.glob` to auto-discover every `info.json`, `body.json`, and `students.json` inside `data/<class>/<number>/`. No imports to maintain — drop a folder, restart dev server, done.

The "wrong-only" student format gets expanded at load time: questions NOT listed in `wrong` are assumed correct, and the scoring engine receives a full answer array either way.

### Grade Display

Grades are provided by teachers in `students.json`. The app just displays them.
Weighted average = `Σ(grade × coeff) / Σ(coeff)`, computed per class in `data/index.js`.

---

## How To Change Things

### "I want to change the colors"

Edit `src/index.css` — all colors are defined in `@theme`:
```css
--color-tm-cyan: #00d4ff;    /* accent color */
--color-tm-green: #00ff41;   /* correct / success */
--color-tm-red: #ff3333;     /* wrong / error */
--color-tm-yellow: #ffd700;  /* partial / warning */
--color-tm-bg: #0a0a1a;      /* page background */
```

These generate Tailwind classes: `text-tm-cyan`, `bg-tm-green`, `border-tm-red`, etc.

For dynamic colors used in JS (score-based), edit the `C` object in `theme.js`.

### "I want to change the animations"

Edit `src/theme.js` — all framer-motion presets are exported:
- `fadeSlide` — screen transitions
- `scaleIn` — login terminal entrance
- `stagger` / `staggerItem` — card list animations
- `shake` — wrong ID error
- `delayedFade(delay)` / `delayedScale(delay)` — login sequence

To remove all animations: replace motion components with regular `div`s and remove framer-motion import.

### "I want to change the login screen look"

Edit `src/screens/LoginScreen.jsx`. The terminal frame is pure HTML/Tailwind — title bar, traffic light dots, prompt line. No SVG, no images.

### "I want to change how scores are displayed"

Edit the relevant screen:
- Dashboard average → `DashboardScreen.jsx`
- Exam card preview → `ExamCard` in `components.jsx`
- Question detail → `QuestionCard` in `components.jsx`

### "I want to change the weighted average logic"

Edit `computeWeightedAverage()` in `data/index.js`.

### "I want to change the grade thresholds (colors/labels)"

Two places:
- `gradeColor()` in `theme.js` — picks green/yellow/red based on percentage
- Grade label (`EXCELLENT/GOOD/PASS/FAIL`) in `ExamDetailScreen.jsx`

### "I want to add a new body type (not MCQ)"

1. Add the new format in `body.json` with a different `bodyType`
2. Add a scoring function in `scoring.js`
3. Add a new card component in `components.jsx`
4. Add a conditional render in `ExamDetailScreen.jsx` based on `bodyType`

### "I want to deploy this"

```bash
npm run build
```

The `dist/` folder is a static site — drop it on any hosting (Netlify, Vercel, GitHub Pages, or a simple nginx). No backend needed.

---

## For Teachers

You only need to touch the `data/` folder. Read `data/README.md` for:
- How to add an exam (3 JSON files)
- How to convert your Markdown exam using AI
- How to convert graded CSV to students.json
- Templates and examples for every file
