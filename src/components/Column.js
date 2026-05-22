import React, { useState } from "react";
import Card from "./Card";

var COL_META = {
    "Todo": { accent: "#818cf8", icon: "○", gradient: "linear-gradient(135deg,#818cf8,#6366f1)" },
    "In Progress": { accent: "#fb923c", icon: "◑", gradient: "linear-gradient(135deg,#fb923c,#f59e0b)" },
    "Done": { accent: "#34d399", icon: "●", gradient: "linear-gradient(135deg,#34d399,#10b981)" }
};

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
            function(e) { e.preventDefault();
                setOver(true); } }
        onDragLeave = {
            function() { setOver(false); } }
        onDrop = {
            function(e) { e.preventDefault();
                setOver(false);
                onDrop(col, null); } } >
        <
        div className = "col-header" >
        <
        div className = "col-title-wrap" >
        <
        div className = "col-icon-wrap"
        style = {
            { background: m.gradient } } >
        <
        span style = {
            { color: "#fff", fontSize: "13px" } } > { m.icon } < /span> <
        /div> <
        span className = "col-name" > { col } < /span> <
        span className = "col-count"
        style = {
            { background: m.gradient } } > { tasks.length } <
        /span> <
        /div> <
        button className = "btn-add-col"
        style = {
            { color: m.accent } }
        onClick = {
            function() { onAdd(col); } } >
        +Add <
        /button> <
        /div>

        <
        div className = "card-list" > {
            tasks.length === 0 ? ( <
                div className = "empty-col" >
                <
                div className = "empty-icon" > [] < /div> <
                div className = "empty-text" > Drop tasks here < /div> <
                /div>
            ) : null
        } {
            tasks.map(function(task, idx) {
                return ( <
                    div key = { task.id }
                    onDragOver = {
                        function(e) { e.preventDefault();
                            e.stopPropagation(); } }
                    onDrop = {
                        function(e) { e.preventDefault();
                            e.stopPropagation();
                            onDrop(col, idx); } } >
                    <
                    Card task = { task }
                    onEdit = { onEdit }
                    onDelete = { onDelete }
                    dragging = { draggingId === task.id }
                    onDragStart = { onDragStart }
                    onDragEnd = { onDragEnd }
                    /> <
                    /div>
                );
            })
        } <
        /div> <
        /div>
    );
}

export default Column;