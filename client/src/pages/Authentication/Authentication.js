import React, { useEffect, useState } from "react";
import "./Authentication.css";
import Login from "../../components/Login/Login";
import Signup from "../../components/Signup/Signup";
import { useNavigate } from "react-router-dom";
function Authentication() {
  const [auth, setAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      navigate("/Dashboard");
    }
  });

  function changeState(e) {
    setAuth(e);
  }
  return (
    <div className="auth-container">
      <div className="mybg">
        <div className="heading">
          <h1>Foodie</h1>
          <h3>Savor Every Bite, Simplify Every Meal.</h3>
        </div>
      </div>
      <div className="form-container">
        <div className="mobile-heading">
        <h1>Foodie</h1>
        <h3>Savor Every Bite, Simplify Every Meal.</h3>
        </div>
        {auth ? (
          <Login changeState={changeState} />
        ) : (
          <Signup changeState={changeState} />
        )}
      </div>
    </div>
  );
}

export default Authentication;
