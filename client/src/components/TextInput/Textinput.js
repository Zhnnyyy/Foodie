import React from "react";
import "../../assets/style/variable.css";
import "./Textinput.css";
function Textinput(props) {
  return (
    <div className="input-container">
      <label htmlFor={props.id}>{props.placeholder}</label>
      <input
        type={props.type}
        autoComplete="off"
        id={props.id}
        name={props.id}
        onChange={props.onChange}
        value={props.value}
      />
      {props.error && <span className="error">{props.error}</span>}
      {!props.error && props.mismatch && (
        <span className="error">{props.mismatch}</span>
      )}
    </div>
  );
}

export default Textinput;
