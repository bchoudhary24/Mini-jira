import React from "react";

var PRIORITY_COLORS = {
    Low: { bg: "rgba(16,185,129,0.15)", text: "#10b981", dot: "#10b981", border: "rgba(16,185,129,0.3)" },
    Medium: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b", dot: "#f59e0b", border: "rgba(245,158,11,0.3)" },
    High: { bg: "rgba(239,68,68,0.15)", text: "#ef4444", dot: "#ef4444", border: "rgba(239,68,68,0.3)" }
};

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
            function() { onEdit(task); } } > Edit < /button> <
        button className = "btn-icon btn-del"
        onClick = {
            function() { onDelete(task.id); } } > Del < /button> <
        /div> <
        /div> <
        div className = "card-meta" >
        <
        span className = "priority-badge"
        style = {
            { background: pc.bg, color: pc.text, borderColor: pc.border } } >
        <
        span className = "priority-dot"
        style = {
            { background: pc.dot } }
        /> { task.priority } <
        /span> {
            task.assignee ? ( <
                span className = "assignee-wrap" >
                <
                span className = "avatar" > { task.assignee[0].toUpperCase() } < /span> { task.assignee } <
                /span>
            ) : null
        } <
        /div> <
        /div>
    );
}

export default Card;