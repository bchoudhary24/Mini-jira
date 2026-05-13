var SEED = [
    { id: "s1", title: "Design login page", priority: "High", assignee: "Priya", status: "Todo", order: 0 },
    { id: "s2", title: "Set up API routes", priority: "Medium", assignee: "Rahul", status: "Todo", order: 1 },
    { id: "s3", title: "Write unit tests", priority: "Low", assignee: "Aman", status: "In Progress", order: 0 },
    { id: "s4", title: "Fix nav bar bug", priority: "High", assignee: "Priya", status: "In Progress", order: 1 },
    { id: "s5", title: "Deploy staging env", priority: "Medium", assignee: "Rahul", status: "Done", order: 0 }
];

export function loadTasks() {
    try { return JSON.parse(localStorage.getItem("mjira_v4")) || SEED; } catch (e) { return SEED; }
}

export function saveTasks(t) {
    try { localStorage.setItem("mjira_v4", JSON.stringify(t)); } catch (e) {}
}

export function uid() {
    return Math.random().toString(36).slice(2, 9);
}