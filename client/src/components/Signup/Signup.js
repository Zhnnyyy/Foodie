import React, { useState } from "react";
import "../../assets/style/variable.css";
import "./Signup.css";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Textinput from "../TextInput/Textinput";
import Button from "../Button/Button";
import makeRequest from "../../services/makeRequest";
import { bouncy } from "ldrs";
import Alert from "../Alert/Alert";
import { useNavigate, useParams } from "react-router-dom";
bouncy.register();
function Signup(props) {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState({});
  const [isError, setIsError] = useState(false);
  const [frmdata, setfrmdata] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const navigate = useNavigate();
  function validation(frmdata) {
    let error = {};
    if (!frmdata.name) {
      error.name = "Please enter your name";
    }
    if (!frmdata.email) {
      error.email = "Please enter your email";
    }
    if (!frmdata.password || frmdata.password.length <= 5) {
      if (!frmdata.password) {
        error.password = "Please enter your password";
      } else {
        error.password = "Password must be at least 6 characters long";
      }
    }
    if (!frmdata.cpassword) {
      error.cpassword = "Please enter your password";
    }
    if (frmdata.password !== frmdata.cpassword) {
      error.matching = "Password mismatch";
    }
    return error;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const error = validation(frmdata);

    if (Object.keys(error).length === 0) {
      sendVerification();
    } else {
      setError(error);
    }
  }

  async function sendVerification() {
    const random = Math.floor(100000 + Math.random() * 900000);
    sessionStorage.setItem("code", random);
    try {
      const data = {
        email: frmdata.email,
        subject: "Verification",
        code: random,
      };
      const result = await makeRequest(
        `${process.env.REACT_APP_PROXY}/user/verification`,
        "POST",
        data,
        setLoading
      );
      if (!result.Error) {
        setMsg("Proceed to verification");
        setIsError(false);
        setAlert(true);
        sessionStorage.setItem("key", true);
        sessionStorage.setItem("data", JSON.stringify(frmdata));
        setTimeout(() => {
          navigate("/verification");
        }, 2000);
      } else {
        setMsg(result.message);
        setIsError(true);
        setAlert(true);
      }
    } catch (error) {}
  }

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

  function doFacebook(e) {
    e.preventDefault();
  }

  function doGoogle() {}

  return (
    <div className="signup-container">
      <Alert isShow={alert} onClose={setAlert} msg={msg} Error={isError} />

      <div className="form-containers">
        <h3>Create an account</h3>
        <p>Sign up to start sharing your culinary creations.</p>
      </div>
      <div className="form-containers">
        <form onSubmit={handleSubmit}>
          <div className="third-party-button">
            <button type="button" onClick={doGoogle}>
              {" "}
              <FaGoogle /> Google
            </button>
            <button type="button" onClick={doFacebook}>
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
            placeholder={"Name"}
            id={"name"}
            type={"text"}
            value={frmdata.name}
            onChange={handleChange}
            error={error.name}
          />

          <Textinput
            placeholder={"Email"}
            id={"email"}
            type={"email"}
            value={frmdata.email}
            onChange={handleChange}
            error={error.email}
          />

          <Textinput
            placeholder={"Password"}
            id={"password"}
            type={"password"}
            value={frmdata.password}
            onChange={handleChange}
            error={error.password}
            // mismatch={error.matching}
          />

          <Textinput
            placeholder={"Confirm Password"}
            id={"cpassword"}
            type={"password"}
            value={frmdata.cpassword}
            onChange={handleChange}
            error={error.cpassword}
            mismatch={error.matching}
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
                  "Sign Up"
                )
              }
            />

            <p>
              Already have an account?{" "}
              <span onClick={() => props.changeState(true)}>
                <u>Sign In</u>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Signup;
