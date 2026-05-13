import React, { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/Card";
import Column from "./components/Column";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import { loadTasks, saveTasks, uid } from "./utils/storage";

var COLUMNS = ["Todo", "In Progress", "Done"];

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
        setTasks(function(prev) {
            return prev.concat([Object.assign({}, form, { id: uid(), order: existing.length })]);
        });
        setModal(null);
        showToast("Task created!", "success");
    }

    function updateTask(form) {
        pushHistory(tasks);
        setTasks(function(prev) {
            return prev.map(function(t) { return t.id === form.id ? Object.assign({}, t, form) : t; });
        });
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
            var colList = rest
                .filter(function(t) { return t.status === targetCol; })
                .sort(function(a, b) { return a.order - b.order; });
            colList.splice(
                targetIdx === null ? colList.length : targetIdx,
                0,
                Object.assign({}, dragged, { status: targetCol })
            );
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
        div className = "logo-sub" > Issue Tracker < /div> <
        /div> <
        /div> <
        div className = "header-actions" >
        <
        button className = "btn-undo"
        onClick = { undo }
        disabled = {!history.length } > Undo < /button> <
        button className = "btn-new"
        onClick = {
            function() { openCreate(); } } > +New Task < /button> <
        /div> <
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
                        function() { setPriF(p); } } > { p } <
                    /button>
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
                        function() { setAssF(a); } } > { a } <
                    /button>
                );
            })
        } <
        /div> {
            (priF !== "All" || assF !== "All") ? ( <
                button className = "btn-clear"
                onClick = {
                    function() { setPriF("All");
                        setAssF("All"); } } >
                X Clear <
                /button>
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
                        function() { setDragId(null); } }
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
                    function() { setModal(null); } }
                onSave = { modal.isEdit ? updateTask : createTask }
                />
            ) : null
        }

        {
            toast ? < Toast msg = { toast.msg }
            type = { toast.type }
            /> : null} <
            /div>
        );
    }