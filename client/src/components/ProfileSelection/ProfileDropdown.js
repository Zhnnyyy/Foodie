import React from "react";
import "../../assets/style/variable.css";
import "./ProfileDropdown.css";
import { useNavigate } from "react-router-dom";
function ProfileDropdown(props) {
  const navigate = useNavigate();
  return (
    <div
      className={`ProfileDropdown-container ${
        props.isVisible ? "show" : "hide"
      }`}
    >
      <button onClick={(e) => navigate("/user/profile")}>My Profile</button>
      <button>Settings</button>
      <button
        onClick={(e) => {
          localStorage.removeItem("USER_ID");
          localStorage.removeItem("isLoggedIn");
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default ProfileDropdown;
