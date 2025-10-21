import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import { login, register } from "../../api/api.js";
import InputField from "../InputField/InputField.jsx";
import "./AuthModal.css";

const AuthModal = forwardRef(function AuthModal({ onLoginSuccess }, ref) {
  const dialogRef = useRef();

  // mode: "login" or "signup"
  const [mode, setMode] = useState("login");

  const [credentials, setCredentials] = useState({
    userName: "",
    password: "",
  });

  useImperativeHandle(ref, () => ({
    showModal: (defaultMode = "login") => {
      setMode(defaultMode);
      dialogRef.current.showModal();
    },
    close: () => dialogRef.current.close(),
  }));

  function handleChange(e) {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (mode === "login") {
        const data = await login(credentials);
        console.log("Logged in: ", data);
        localStorage.setItem("token", data.token); //  save token
        onLoginSuccess();
      } else {
        const data = await register(credentials);
        console.log("Registered: ", data);
        localStorage.setItem("token", data.token); //  save token
        onLoginSuccess(); // behave like login success
      }
      dialogRef.current.close();
    } catch (err) {
      console.error(`${mode} failed: `, err);
      alert(`${mode} failed. Please check inputs.`);
    }
  }
  

  function handleCancel() {
    dialogRef.current.close();
  }

  return createPortal(
    <dialog ref={dialogRef}>
      <h2>{mode === "login" ? "Admin Login" : "Admin Signup"}</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          id="username"
          name="userName"
          placeholder="Enter Username"
          value={credentials.userName}
          onChange={handleChange}
          type="text"
        />

        <InputField
          id="password"
          name="password"
          placeholder="Enter Password"
          value={credentials.password}
          onChange={handleChange}
          type="password"
        />

        <div className="btn-group">
          <button type="submit">
            {mode === "login" ? "Login" : "Signup"}
          </button>
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>

      <p style={{ marginTop: "1rem" }}>
        {mode === "login" ? (
          <>
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="link-btn"
            >
              Signup
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="link-btn"
            >
              Login
            </button>
          </>
        )}
      </p>
    </dialog>,
    document.getElementById("modal-root")
  );
});

export default AuthModal;
