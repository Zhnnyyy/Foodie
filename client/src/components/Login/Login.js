import React, { useState } from "react";
import "../../assets/style/variable.css";
import "./Login.css";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Textinput from "../TextInput/Textinput";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import makeRequest from "../../services/makeRequest";
import { bouncy } from "ldrs";
import Alert from "../Alert/Alert";
bouncy.register();
function Login(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [frmdata, setfrmdata] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setfrmdata((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validation({
      ...frmdata,
      [name]: value,
    });
    setError(error);
  }

  function validation(data) {
    let error = {};
    if (!data.email) {
      error.email = "Email is required";
    }
    if (!data.password) {
      error.password = "Password is required";
    }
    return error;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const error = validation(frmdata);

    if (Object.keys(error).length === 0) {
      doLogin();
    } else {
      setError(error);
    }
  }

  async function doLogin() {
    try {
      const result = await makeRequest(
        `${process.env.REACT_APP_PROXY}/user/login`,
        "POST",
        frmdata,
        setLoading
      );

      if (!result.Error) {
        if (Object.keys(result.data).length === 0) {
          setMsg("Invalid Credentials");
          setAlert(true);
          setIsError(true);
        } else {
          localStorage.setItem("USER_ID", result.data[0].id);
          localStorage.setItem("isLoggedIn", true);
          setMsg("Proceed to Dashboard");
          setIsError(false);
          setAlert(true);
          setTimeout(() => {
            setAlert(false);
            navigate("/dashboard");
          }, 2000);
        }
      } else {
        setMsg(result.message);
        setAlert(true);
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function handleGoogle() {}
  async function handleFacebook() {}
  return (
    <div className="login-container">
      <Alert isShow={alert} onClose={setAlert} msg={msg} Error={isError} />
      <div className="form-containers">
        <h3>Welcome to Foodie</h3>
        <p>
          Sign in or create an account to start sharing your culinary creations
        </p>
      </div>
      <div className="form-containers">
        <form onSubmit={handleSubmit}>
          <div className="third-party-button">
            <button type="button" onClick={handleGoogle}>
              {" "}
              <FaGoogle /> Google
            </button>
            <button type="button" onClick={handleFacebook}>
              {" "}
              <FaFacebook /> Facebook
            </button>
          </div>
          <div className="hrline">
            <hr />
            OR CONTINUE WITH
            <hr />
          </div>
          <Textinput
            placeholder={"Email"}
            id={"email"}
            type={"email"}
            onChange={handleChange}
            value={frmdata.email}
            error={error.email}
          />
          <Textinput
            placeholder={"Password"}
            id={"password"}
            type={"password"}
            onChange={handleChange}
            value={frmdata.password}
            error={error.password}
          />
          <div className="form-footer">
            <Button
              type={"submit"}
              bg={"#18181a"}
              txtColor={"#fff"}
              txt={
                loading ? (
                  <l-bouncy size="45" speed="1.75" color="#fff"></l-bouncy>
                ) : (
                  "Sign In"
                )
              }
            />
            <p>
              Don't have an account?{" "}
              <span onClick={() => props.changeState(false)}>
                <u>Signup</u>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
