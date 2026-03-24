# Data Guide

This folder contains all exam data. **No code here — only JSON files.**

The app auto-discovers everything. Add a folder → it shows up.

---

## Structure

```
data/
  classes.json              ← list of courses (rarely changes)
  <class_id>/
    <exam_number>/
      info.json             ← exam metadata
      body.json             ← questions & answers
      students.json         ← student results
```

Example:
```
data/
  os/00/   ← first OS exam
  os/01/   ← second OS exam
  net/00/  ← first Networking exam
  fp/00/   ← first FP exam
```

---

## Adding a new exam (step by step)

### 1. Create the folder

```bash
mkdir -p src/data/os/01
```

Use the class id (`os`, `net`, `fp`) and the next number (`01`, `02`...).

### 2. Create `info.json`

```json
{
  "title": "Operating Systems – Final Exam",
  "date": "2026-06-15",
  "publishedDate": "2026-06-18",
  "totalPoints": 100,
  "coeff": 40
}
```

| Field           | Description                                      |
|-----------------|--------------------------------------------------|
| `title`         | Display name shown to students                   |
| `date`          | When the exam took place (YYYY-MM-DD)            |
| `publishedDate` | When results go live — **controls default tab**   |
| `totalPoints`   | Total points (always 100 for now)                |
| `coeff`         | Weight as a percentage (10 = 10% of final grade) |

### 3. Create `body.json`

```json
{
  "bodyType": "mcq",
  "questions": [
    {
      "id": 1,
      "text": "What is a process?",
      "options": {
        "A": "A file on disk",
        "B": "A program in execution",
        "C": "A CPU register",
        "D": "A kernel module"
      },
      "correct": ["B"],
      "mode": "any",
      "explanation": "A process is a program that has been loaded into memory and is being executed by the CPU."
    },
    {
      "id": 2,
      "text": "Which are valid IPC mechanisms?",
      "options": {
        "A": "Pipes",
        "B": "Shared memory",
        "C": "USB",
        "D": "Sockets"
      },
      "correct": ["A", "B", "D"],
      "mode": "all",
      "explanation": "Pipes, shared memory, and sockets are IPC mechanisms. USB is a hardware interface."
    }
  ]
}
```

| Field             | Description                                                |
|-------------------|------------------------------------------------------------|
| `bodyType`        | Always `"mcq"` for now. Future: `"open"`, `"code"`, etc.  |
| `questions[].id`  | Unique number within this exam (1, 2, 3...)                |
| `questions[].text`| The question text                                          |
| `questions[].options` | Object with letter keys: `{ "A": "...", "B": "..." }`|
| `questions[].correct` | Array of correct letter(s): `["B"]` or `["A", "D"]`  |
| `questions[].mode`    | `"any"` = pick one correct, `"all"` = pick all correct|
| `questions[].explanation` | Why the answer is correct (shown to students)     |

**Scoring rules:**
- `mode: "any"` → student picks **one** answer. If it's in `correct`, full points.
- `mode: "all"` → student must pick a **subset** of correct answers. Partial credit = (correct picks / total correct). **Any wrong pick = 0 points.**

### 4. Create `students.json`

**Grade is always required.** The `wrong` field is optional — adds question-level detail.

#### Detailed mode (recommended — shows question-by-question review)

Only list **wrong** answers. Questions not listed = student got it right.

```json
{
  "20230001": {
    "name": "Zhang Wei",
    "grade": 100,
    "wrong": {}
  },
  "20230002": {
    "name": "Li Ming",
    "grade": 40,
    "wrong": {
      "1": "A",
      "3": "ABC",
      "5": "D"
    }
  }
}
```

- Keys in `wrong` are **question IDs as strings** (`"1"`, `"2"`, etc.)
- Values are what the student **actually picked** (letters concatenated: `"A"`, `"AC"`, `"ABD"`)
- Empty `wrong: {}` = perfect score

#### Simple mode (grade only)

```json
{
  "20230001": {
    "name": "Zhang Wei",
    "grade": 85
  }
}
```

Students without `wrong` can't click into exam details — they see their grade only.

---

## Adding a new class

1. Edit `classes.json`:

```json
[
  { "id": "net", "label": "Net", "fullName": "Networking" },
  { "id": "os", "label": "OS", "fullName": "Operating Systems" },
  { "id": "fp", "label": "FP", "fullName": "Functional Programming" },
  { "id": "db", "label": "DB", "fullName": "Databases" }
]
```

2. Create the folder: `mkdir src/data/db`
3. Add exams inside it: `mkdir src/data/db/00` + the three JSON files

---

## Converting your Markdown exam to JSON with AI

If your exam is already written in Markdown, use this prompt to convert it:

```
Convert the following exam to two JSON files.

FILE 1 — info.json:
{
  "title": "<exam name>",
  "date": "<exam date YYYY-MM-DD>",
  "publishedDate": "<today YYYY-MM-DD>",
  "totalPoints": 100,
  "coeff": <percentage, e.g. 10 = 10%>
}

FILE 2 — body.json:
{
  "bodyType": "mcq",
  "questions": [
    {
      "id": <number starting from 1>,
      "text": "<question text>",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct": ["<letter(s)>"],
      "mode": "any" or "all",
      "explanation": "<generate an educational explanation of why the correct answer is correct>"
    }
  ]
}

Rules:
- Default mode to "any" (single correct answer) unless I say otherwise
- Generate clear, educational explanations for each question
- Keep option letters matching the original exam

Here is my exam:
<paste your markdown here>
```

---

## Converting your graded papers to students.json

After grading paper MCQs, fill a CSV like this:

```csv
student_id, name, q1, q2, q3, q4, q5
20230001, Zhang Wei, C, B, AB, B, B
20230002, Li Ming, A, B, A, B, D
```

Then use this prompt:

```
Convert this CSV of student answers into students.json format.

The correct answers for each question are:
Q1: C
Q2: B
Q3: A,B (mode: all)
Q4: B
Q5: B

Generate a JSON where each student has:
- "name": their name
- "wrong": an object where keys are question IDs (as strings)
  and values are the student's wrong answer (letters concatenated).
  Only include questions where the student got it wrong.
  If the student got everything right, use "wrong": {}

CSV:
<paste your CSV here>
```

---

## Quick checklist for adding an exam

- [ ] Create folder: `data/<class>/<number>/`
- [ ] Create `info.json` with title, dates, points, coeff
- [ ] Create `body.json` with bodyType and questions array
- [ ] Create `students.json` with student results (detailed or simple)
- [ ] Run `npm run dev` — exam appears automatically
