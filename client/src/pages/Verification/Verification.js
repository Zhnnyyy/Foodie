import React, { useEffect, useState } from "react";
import "../../assets/style/variable.css";
import "./Verification.css";
import Textinput from "../../components/TextInput/Textinput";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert/Alert";
import { bouncy } from "ldrs";
import makeRequest from "../../services/makeRequest";
bouncy.register();
function Verification() {
  const [code, setCode] = useState();
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("key") == null) {
      navigate("/page_not_found");
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (code === sessionStorage.getItem("code")) {
      setMsg("Verification Success");
      setIsError(false);
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
        createUser(JSON.parse(sessionStorage.getItem("data")));
      }, 1500);
    } else {
      setMsg("Incorrect code");
      setIsError(true);
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
  }
  function handleChange(e) {
    setCode(e.target.value);
  }

  async function createUser(data) {
    try {
      const result = await makeRequest(
        `${process.env.REACT_APP_PROXY}/user/create`,
        "POST",
        data,
        setLoading
      );
      if (!result.Error) {
        setMsg(result.message);
        setIsError(false);
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
          sessionStorage.removeItem("key");
          sessionStorage.removeItem("code");
          sessionStorage.removeItem("data");
          navigate("/");
        }, 3000);
      } else {
        setMsg(result.message);
        setIsError(true);
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      }
    } catch (error) {}
  }

  return (
    <div className="verification-container">
      <Alert isShow={alert} onClose={setAlert} msg={msg} Error={isError} />
      <form onSubmit={handleSubmit}>
        <div className="form-verification">
          <h2>Verify your email</h2>
          <p>
            Enter the 6-digit code we sent to your email address to confirm your
            identity.
          </p>

          <Textinput
            type={"number"}
            placeholder={"Verification code"}
            onChange={handleChange}
          />
          <br />
          <br />
          <Button
            type={"submit"}
            bg={"#18181a"}
            txtColor={"#fff"}
            txt={
              loading ? (
                <l-bouncy size="45" speed="1.75" color="#fff"></l-bouncy>
              ) : (
                "Verify code"
              )
            }
          />
        </div>
      </form>
    </div>
  );
}

export default Verification;
