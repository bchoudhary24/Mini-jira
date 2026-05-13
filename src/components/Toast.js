import React from "react";

function Toast(props) {
    return ( <
        div className = { "toast toast-" + (props.type || "info") } > { props.msg } <
        /div>
    );
}

export default Toast;