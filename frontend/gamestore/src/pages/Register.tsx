import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { isAxiosError } from "axios";

import { EmailInput } from "../components/auth/EmailInput";
import { PasswordInput } from "../components/auth/PasswordInput";

import "../styles/auth.css";

const REGISTER_URL = "/auth/register";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const errRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  // Validaciones
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
    setValidPassword(password.length >= 8);
    setPasswordMatch(password === confirmPassword && confirmPassword.length > 0);
  }, [email, password, confirmPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validEmail || !validPassword || !passwordMatch) {
      setErrMsg("Invalid entry");
      return;
    }

    try {
      await axios.post(REGISTER_URL, {
        email,
        password,
        confirmPassword,
      });

      navigate("/login");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (!err.response) setErrMsg("No Server Response");
        else if (err.response.status === 409)
          setErrMsg("Email already exists");
        else setErrMsg("Registration failed");
      } else {
        setErrMsg("Unexpected error");
      }
      errRef.current?.focus();
    }
  };

  return (
    <div className="auth-page">
      <section className="principal-container">
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>

        <h1>Sign Up</h1>

        <form onSubmit={handleSubmit}>
          <EmailInput value={email} onChange={setEmail} isValid={validEmail} />

          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            isValid={validPassword}
            showValidation
          />

          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            isValid={passwordMatch}
            showValidation
          />

          <button
            className="action-btn"
            disabled={!validEmail || !validPassword || !passwordMatch}
          >
            Sign Up
          </button>

          <p>
            Already have an account?
            <br />
            <span className="line">
              <Link to="/login">Sign In</Link>
            </span>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Register;
