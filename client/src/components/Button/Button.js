import React from "react";
import "./Button.css";
function Button(props) {
  return (
    <button
      className="customButton"
      style={{ background: props.bg, color: props.txtColor }}
      type={props.type}
    >
      {props.txt}
    </button>
  );
}

export default Button;
