import React from "react";
import "../../assets/style/variable.css";
import "./Alert.css";
import { IoIosClose } from "react-icons/io";

function Alert(props) {
  function onClose() {
    props.onClose(false);
  }
  setTimeout(() => {
    props.onClose(false);
  }, 3000);
  return (
    <div
      className={`alert-container ${props.isShow ? "show" : ""}`}
      style={{
        background: props.Error ? "var(--errorAlert)" : "var(--successAlert)",
        color: props.Error ? "var(--errorTxt)" : "var(--successTxt)",
      }}
    >
      <IoIosClose onClick={onClose} /> <p>{props.msg}</p>
    </div>
  );
}

export default Alert;
