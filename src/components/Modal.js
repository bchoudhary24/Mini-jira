import React, { useState, useEffect, useRef } from "react";

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
        onSave(Object.assign({}, form, {
            title: form.title.trim(),
            assignee: form.assignee.trim()
        }));
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
        onClick = { onClose } > X < /button> <
        /div>

        <
        label className = "form-label" > Title * < /label> <
        input ref = { ref }
        className = { err ? "form-input error" : "form-input" }
        value = { form.title }
        placeholder = "What needs to be done?"
        onChange = {
            function(e) { set("title", e.target.value);
                setErr(""); } }
        onKeyDown = {
            function(e) { if (e.key === "Enter") { submit(); } } }
        /> {
            err ? < div className = "err-text" > { err } < /div> : null}

            <
            label className = "form-label" > Assignee < /label> <
                input className = "form-input"
            value = { form.assignee }
            placeholder = "Who owns this?"
            onChange = {
                function(e) { set("assignee", e.target.value); } }
            />

            <
            div className = "form-row" >
                <
                div >
                <
                label className = "form-label" > Priority < /label> <
                select className = "form-select"
            value = { form.priority }
            onChange = {
                    function(e) { set("priority", e.target.value); } } >
                <
                option > Low < /option> <
                option > Medium < /option> <
                option > High < /option> <
                /select> <
                /div> <
                div >
                <
                label className = "form-label" > Status < /label> <
                select className = "form-select"
            value = { form.status }
            onChange = {
                    function(e) { set("status", e.target.value); } } >
                <
                option > Todo < /option> <
                option > In Progress < /option> <
                option > Done < /option> <
                /select> <
                /div> <
                /div>

            <
            div className = "modal-footer" >
                <
                button className = "btn-cancel"
            onClick = { onClose } > Cancel < /button> <
                button className = "btn-save"
            onClick = { submit } > { form.id ? "Save Changes" : "Create Task" } <
                /button> <
                /div> <
                /div> <
                /div>
        );
    }

    export default Modal;