# MiniJira — Issue Tracker

A Kanban-style issue tracking app built with React JS, inspired by tools like Jira.

## Live Demo
> Run locally with `npm start` — opens at `http://localhost:3000`

---

## Features

### Core
- **Kanban Board** — Three columns: Todo, In Progress, Done
- **Task Cards** — Each card shows title, priority (Low/Medium/High), and assignee
- **Create Tasks** — Click "+ New Task" or "+ Add" in any column
- **Edit Tasks** — Click "Edit" on any card to update details
- **Delete Tasks** — Click "Del" to remove a task
- **Title Validation** — Title is required; empty submissions are blocked

### Task Movement
- **Drag & Drop** — Drag cards across columns or reorder within the same column
- **Instant Updates** — Board reflects changes immediately after drop

### Additional
- **Filter by Priority** — Low / Medium / High / All
- **Filter by Assignee** — Dynamic list based on existing tasks
- **Persist State** — Board data saved to `localStorage`; survives page refresh
- **Undo** — Reverts the most recent action (create, edit, delete, move)
- **Toast Notifications** — Feedback shown for every user action

---

## Tech Stack

| Technology | Usage |
|---|---|
| React JS | UI components, state management |
| JavaScript (ES6) | Application logic |
| CSS (external file) | Styling, animations, transitions |
| HTML5 Drag & Drop API | Card movement between columns |
| localStorage | Persisting board state |

> No external UI libraries used — built with pure React + browser APIs.

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/mini-jira.git
cd mini-jira

# Install dependencies
npm install

# Start development server
npm start
```

Opens at `http://localhost:3000`

---
## Project Structure

src/
├── App.js                  # Main component — state, logic
├── App.css                 # All styles and animations
├── components/
│   ├── Card.js             # Task card — drag, edit, delete
│   ├── Column.js           # Kanban column — drop target
│   ├── Modal.js            # Create/Edit task form
│   └── Toast.js            # Notification component
└── utils/
    └── storage.js          # localStorage + seed data + uid helper
```

---

## Approach

- **State Management** — Used React `useState` for all state (tasks, filters, drag, modal, history, toast). No external state library needed at this scale.
- **Drag & Drop** — Implemented using the native HTML5 Drag & Drop API. Each card is `draggable`. Drop targets are the column container and individual card slots for precise reordering.
- **Undo** — Maintained a history stack (last 20 snapshots). Every mutating action pushes the current state before modifying it.
- **Persistence** — Tasks are serialized to JSON and saved to `localStorage` on every state change via `useEffect`.
- **Filtering** — Filters are applied in-memory at render time, not stored separately. This means drag & drop works correctly even with active filters.

---

## Trade-offs

| Decision | Reason |
|---|---|
| Single `App.js` file | Keeps the project simple for this scope; easier to review |
| Native Drag & Drop API | No extra dependency; works well for a board this size |
| No Redux / Zustand | Overkill for this scale; `useState` is sufficient |
| No TypeScript | Kept JS for faster development within the time constraint |

---

## What I Would Improve With More Time

- **Split into separate component files** — `Card.js`, `Column.js`, `Modal.js`, `hooks/useTasks.js`
- **Add TypeScript** — Better type safety and developer experience
- **Smooth drag animations** — Use a library like `@dnd-kit` for better drag preview and animation
- **Due dates** — Add deadline field with color-coded urgency
- **Multi-select** — Bulk move or delete tasks
- **Unit tests** — Test core logic (task creation, drag, undo, filters)
- **Responsive design** — Better mobile layout for the Kanban board

---

## Author

Built as part of a Frontend Internship assignment.