import { useState, useEffect, useRef } from "react";
import "./App.css";

var uid = function() { return Math.random().toString(36).slice(2, 9); };
var COLUMNS = ["Todo", "In Progress", "Done"];

var PRIORITY_COLORS = {
    Low: { bg: "rgba(16,185,129,0.15)", text: "#10b981", dot: "#10b981", border: "rgba(16,185,129,0.3)" },
    Medium: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b", dot: "#f59e0b", border: "rgba(245,158,11,0.3)" },
    High: { bg: "rgba(239,68,68,0.15)", text: "#ef4444", dot: "#ef4444", border: "rgba(239,68,68,0.3)" }
};

var COL_META = {
    "Todo": { accent: "#818cf8", icon: "○", gradient: "linear-gradient(135deg,#818cf8,#6366f1)" },
    "In Progress": { accent: "#fb923c", icon: "◑", gradient: "linear-gradient(135deg,#fb923c,#f59e0b)" },
    "Done": { accent: "#34d399", icon: "●", gradient: "linear-gradient(135deg,#34d399,#10b981)" }
};

var SEED = [
    { id: uid(), title: "Design login page", priority: "High", assignee: "Priya", status: "Todo", order: 0 },
    { id: uid(), title: "Set up API routes", priority: "Medium", assignee: "Rahul", status: "Todo", order: 1 },
    { id: uid(), title: "Write unit tests", priority: "Low", assignee: "Aman", status: "In Progress", order: 0 },
    { id: uid(), title: "Fix nav bar bug", priority: "High", assignee: "Priya", status: "In Progress", order: 1 },
    { id: uid(), title: "Deploy staging env", priority: "Medium", assignee: "Rahul", status: "Done", order: 0 }
];

function loadTasks() {
    try { return JSON.parse(localStorage.getItem("mjira_v4")) || SEED; } catch (e) { return SEED; }
}

function saveTasks(t) {
    try { localStorage.setItem("mjira_v4", JSON.stringify(t)); } catch (e) {}
}

function Toast(props) {
    return ( <
        div className = { "toast toast-" + (props.type || "info") } > { props.msg } <
        /div>
    );
}

function Modal(props) {
    var initial = props.initial;
    var onClose = props.onClose;
    var onSave = props.onSave;
    var formState = useState(initial);
    var form = formState[0];
    var setForm = formState[1];
    var errState = useState("");
    var err = errState[0];
    var setErr = errState[1];
    var ref = useRef(null);

    useEffect(function() {
        if (ref.current) { ref.current.focus(); }
    }, []);

    function set(k, v) {
        setForm(function(f) {
            var next = Object.assign({}, f);
            next[k] = v;
            return next;
        });
    }

    function submit() {
        if (!form.title.trim()) { setErr("Title is required!"); return; }
        onSave(Object.assign({}, form, { title: form.title.trim(), assignee: form.assignee.trim() }));
    }

    function handleOverlay(e) {
        if (e.target === e.currentTarget) { onClose(); }
    }

    return ( <
        div className = "overlay"
        onClick = { handleOverlay } >
        <
        div className = "modal" >
        <
        div className = "modal-header" >
        <
        span className = "modal-title" > { form.id ? "Edit Task" : "Create Task" } < /span> <
        button className = "btn-close"
        onClick = { onClose } > X < /button> < /
        div > <
        label className = "form-label" > Title * < /label> <
        input ref = { ref }
        className = { err ? "form-input error" : "form-input" }
        value = { form.title }
        placeholder = "What needs to be done?"
        onChange = {
            function(e) {
                set("title", e.target.value);
                setErr("");
            }
        }
        onKeyDown = {
            function(e) { if (e.key === "Enter") { submit(); } }
        }
        /> {
        err ? < div className = "err-text" > { err } < /div> : null} <
        label className = "form-label" > Assignee < /label> <
        input className = "form-input"
        value = { form.assignee }
        placeholder = "Who owns this?"
        onChange = {
            function(e) { set("assignee", e.target.value); }
        }
        /> <
        div className = "form-row" >
        <
        div >
        <
        label className = "form-label" > Priority < /label> <
        select className = "form-select"
        value = { form.priority }
        onChange = {
            function(e) { set("priority", e.target.value); }
        } >
        <
        option > Low < /option> <
        option > Medium < /option> <
        option > High < /option> < /
        select > <
        /div> <
        div >
        <
        label className = "form-label" > Status < /label> <
        select className = "form-select"
        value = { form.status }
        onChange = {
            function(e) { set("status", e.target.value); }
        } >
        <
        option > Todo < /option> <
        option > In Progress < /option> <
        option > Done < /option> < /
        select > <
        /div> < /
        div > <
        div className = "modal-footer" >
        <
        button className = "btn-cancel"
        onClick = { onClose } > Cancel < /button> <
        button className = "btn-save"
        onClick = { submit } > { form.id ? "Save Changes" : "Create Task" } < /button> < /
        div > <
        /div> < /
        div >
    );
}

function Card(props) {
    var task = props.task;
    var onEdit = props.onEdit;
    var onDelete = props.onDelete;
    var dragging = props.dragging;
    var onDragStart = props.onDragStart;
    var onDragEnd = props.onDragEnd;
    var pc = PRIORITY_COLORS[task.priority];

    return ( <
        div draggable = { true }
        onDragStart = {
            function(e) {
                e.dataTransfer.effectAllowed = "move";
                onDragStart(task.id);
            }
        }
        onDragEnd = { onDragEnd }
        className = { dragging ? "card dragging" : "card" } >
        <
        div className = "card-top" >
        <
        span className = "card-title" > { task.title } < /span> <
        div className = "card-actions" >
        <
        button className = "btn-icon"
        onClick = {
            function() { onEdit(task); }
        } > Edit < /button> <
        button className = "btn-icon btn-del"
        onClick = {
            function() { onDelete(task.id); }
        } > Del < /button> < /
        div > <
        /div> <
        div className = "card-meta" >
        <
        span className = "priority-badge"
        style = {
            { background: pc.bg, color: pc.text, borderColor: pc.border }
        } >
        <
        span className = "priority-dot"
        style = {
            { background: pc.dot }
        }
        /> { task.priority } < /
        span > {
            task.assignee ? ( <
                span className = "assignee-wrap" >
                <
                span className = "avatar" > { task.assignee[0].toUpperCase() } < /span> { task.assignee } < /
                span >
            ) : null
        } <
        /div> < /
        div >
    );
}

function Column(props) {
    var col = props.col;
    var tasks = props.tasks;
    var draggingId = props.draggingId;
    var onDragStart = props.onDragStart;
    var onDragEnd = props.onDragEnd;
    var onDrop = props.onDrop;
    var onEdit = props.onEdit;
    var onDelete = props.onDelete;
    var onAdd = props.onAdd;
    var overState = useState(false);
    var over = overState[0];
    var setOver = overState[1];
    var m = COL_META[col];

    return ( <
        div className = { over ? "column drag-over" : "column" }
        onDragOver = {
            function(e) {
                e.preventDefault();
                setOver(true);
            }
        }
        onDragLeave = {
            function() { setOver(false); }
        }
        onDrop = {
            function(e) {
                e.preventDefault();
                setOver(false);
                onDrop(col, null);
            }
        } >
        <
        div className = "col-header" >
        <
        div className = "col-title-wrap" >
        <
        div className = "col-icon-wrap"
        style = {
            { background: m.gradient }
        } >
        <
        span style = {
            { color: "#fff", fontSize: "13px" }
        } > { m.icon } < /span> < /
        div > <
        span className = "col-name" > { col } < /span> <
        span className = "col-count"
        style = {
            { background: m.gradient }
        } > { tasks.length } < /span> < /
        div > <
        button className = "btn-add-col"
        style = {
            { color: m.accent }
        }
        onClick = {
            function() { onAdd(col); }
        } >
        +Add <
        /button> < /
        div > <
        div className = "card-list" > {
            tasks.length === 0 ? ( <
                div className = "empty-col" >
                <
                div className = "empty-icon" > [] < /div> <
                div className = "empty-text" > Drop tasks here < /div> < /
                div >
            ) : null
        } {
            tasks.map(function(task, idx) {
                return ( <
                    div key = { task.id }
                    onDragOver = {
                        function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                    onDrop = {
                        function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            onDrop(col, idx);
                        }
                    } >
                    <
                    Card task = { task }
                    onEdit = { onEdit }
                    onDelete = { onDelete }
                    dragging = { draggingId === task.id }
                    onDragStart = { onDragStart }
                    onDragEnd = { onDragEnd }
                    /> < /
                    div >
                );
            })
        } <
        /div> < /
        div >
    );
}

export default function App() {
    var tasksState = useState(loadTasks);
    var tasks = tasksState[0];
    var setTasks = tasksState[1];
    var modalState = useState(null);
    var modal = modalState[0];
    var setModal = modalState[1];
    var dragState = useState(null);
    var dragId = dragState[0];
    var setDragId = dragState[1];
    var priFState = useState("All");
    var priF = priFState[0];
    var setPriF = priFState[1];
    var assFState = useState("All");
    var assF = assFState[0];
    var setAssF = assFState[1];
    var histState = useState([]);
    var history = histState[0];
    var setHistory = histState[1];
    var toastState = useState(null);
    var toast = toastState[0];
    var setToast = toastState[1];

    useEffect(function() { saveTasks(tasks); }, [tasks]);

    function pushHistory(snap) {
        setHistory(function(h) { return h.slice(-19).concat([snap]); });
    }

    function showToast(msg, type) {
        setToast({ msg: msg, type: type || "info" });
        setTimeout(function() { setToast(null); }, 2600);
    }

    var allAssignees = ["All"].concat(
        tasks.map(function(t) { return t.assignee; })
        .filter(function(a, i, arr) { return a && arr.indexOf(a) === i; })
    );

    function colTasks(col) {
        return tasks
            .filter(function(t) { return t.status === col; })
            .filter(function(t) { return priF === "All" || t.priority === priF; })
            .filter(function(t) { return assF === "All" || t.assignee === assF; })
            .sort(function(a, b) { return a.order - b.order; });
    }

    function createTask(form) {
        pushHistory(tasks);
        var existing = tasks.filter(function(t) { return t.status === form.status; });
        setTasks(function(prev) { return prev.concat([Object.assign({}, form, { id: uid(), order: existing.length })]); });
        setModal(null);
        showToast("Task created!", "success");
    }

    function updateTask(form) {
        pushHistory(tasks);
        setTasks(function(prev) { return prev.map(function(t) { return t.id === form.id ? Object.assign({}, t, form) : t; }); });
        setModal(null);
        showToast("Task updated!", "info");
    }

    function deleteTask(id) {
        pushHistory(tasks);
        setTasks(function(prev) { return prev.filter(function(t) { return t.id !== id; }); });
        showToast("Task deleted!", "warn");
    }

    function undo() {
        if (!history.length) { showToast("Nothing to undo", "warn"); return; }
        setTasks(history[history.length - 1]);
        setHistory(function(h) { return h.slice(0, -1); });
        showToast("Undo done!", "success");
    }

    function handleDrop(targetCol, targetIdx) {
        if (!dragId) { return; }
        var dragged = null;
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === dragId) { dragged = tasks[i]; break; }
        }
        if (!dragged) { return; }
        pushHistory(tasks);
        setTasks(function(prev) {
            var rest = prev.filter(function(t) { return t.id !== dragId; });
            var colList = rest.filter(function(t) { return t.status === targetCol; }).sort(function(a, b) { return a.order - b.order; });
            colList.splice(targetIdx === null ? colList.length : targetIdx, 0, Object.assign({}, dragged, { status: targetCol }));
            var reordered = colList.map(function(t, i) { return Object.assign({}, t, { order: i }); });
            return rest.filter(function(t) { return t.status !== targetCol; }).concat(reordered);
        });
        setDragId(null);
    }

    function openCreate(status) {
        setModal({ isEdit: false, data: { title: "", priority: "Medium", assignee: "", status: status || "Todo" } });
    }

    function openEdit(task) {
        setModal({ isEdit: true, data: Object.assign({}, task) });
    }

    return ( <
            div className = "mjira-root" >
            <
            div className = "header" >
            <
            div className = "logo-wrap" >
            <
            div className = "logo-icon" > Z < /div> <
            div >
            <
            div className = "logo-text" > MiniJira < /div> <
            div className = "logo-sub" > Issue Tracker < /div> < /
            div > <
            /div> <
            div className = "header-actions" >
            <
            button className = "btn-undo"
            onClick = { undo }
            disabled = {!history.length } > Undo < /button> <
            button className = "btn-new"
            onClick = {
                function() { openCreate(); }
            } > +New Task < /button> < /
            div > <
            /div>

            <
            div className = "filter-bar" >
            <
            span className = "filter-label" > Filter: < /span> <
            div className = "filter-group" > {
                ["All", "Low", "Medium", "High"].map(function(p) {
                    return ( <
                        button key = { p }
                        className = { priF === p ? "filter-btn active" : "filter-btn" }
                        onClick = {
                            function() { setPriF(p); }
                        } > { p } < /button>
                    );
                })
            } <
            /div> <
            span className = "filter-sep" > | < /span> <
            div className = "filter-group" > {
                allAssignees.map(function(a) {
                    return ( <
                        button key = { a }
                        className = { assF === a ? "filter-btn active" : "filter-btn" }
                        onClick = {
                            function() { setAssF(a); }
                        } > { a } < /button>
                    );
                })
            } <
            /div> {
            (priF !== "All" || assF !== "All") ? ( <
                button className = "btn-clear"
                onClick = {
                    function() {
                        setPriF("All");
                        setAssF("All");
                    }
                } > X Clear < /button>
            ) : null
        } <
        /div>

    <
    div className = "board" > {
            COLUMNS.map(function(col) {
                return ( <
                    Column key = { col }
                    col = { col }
                    tasks = { colTasks(col) }
                    draggingId = { dragId }
                    onDragStart = { setDragId }
                    onDragEnd = {
                        function() { setDragId(null); }
                    }
                    onDrop = { handleDrop }
                    onEdit = { openEdit }
                    onDelete = { deleteTask }
                    onAdd = { openCreate }
                    />
                );
            })
        } <
        /div>

    {
        modal ? ( <
            Modal initial = { modal.data }
            onClose = {
                function() { setModal(null); }
            }
            onSave = { modal.isEdit ? updateTask : createTask }
            />
        ) : null
    }

    {
        toast ? < Toast msg = { toast.msg }
        type = { toast.type }
        /> : null} < /
        div >
    );
}