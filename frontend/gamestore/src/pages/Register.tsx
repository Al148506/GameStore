import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "../styles/register.css";
import axios from "../api/axios";
import { isAxiosError } from "axios";
import type { RegisterRequestDto } from "../types/Auth/auth";

const Email_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const Password_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/auth/register";

const Register = () => {
  const EmailRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [EmailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [PasswordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    EmailRef.current?.focus();
  }, []);

  useEffect(() => {
    const result = Email_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = Password_REGEX.test(password);
    setValidPassword(result);
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password, matchPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!Email_REGEX.test(email) || !Password_REGEX.test(password)) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const payload: RegisterRequestDto = { email, password };
      const response = await axios.post(REGISTER_URL, payload);
      console.log(response?.data);
      setSuccess(true);
      setEmail("");
      setPassword("");
      setMatchPassword("");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (!err.response) setErrMsg("No Server Response");
        else if (err.response.status === 409) setErrMsg("Email already taken");
        else setErrMsg("Registration Failed");
      } else {
        setErrMsg("An unexpected error occurred");
      }
      errRef.current?.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <Link to="/login">Sign In</Link>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="Email">
              Email:
              <span className={validEmail ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validEmail || !email ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="text"
              id="Email"
              ref={EmailRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="Emailnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <p
              id="Emailnote"
              className={
                EmailFocus && email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must be a valid Email address.
            </p>

            <label htmlFor="Password">
              Password:
              <span className={validPassword ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPassword || !password ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="Password"
              id="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="Passwordnote"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <p
              id="Passwordnote"
              className={
                PasswordFocus && !validPassword ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8–24 characters, uppercase, lowercase, number & special symbol.
            </p>

            <label htmlFor="confirm_Password">
              Confirm Password:
              <span className={validMatch && matchPassword ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={validMatch || !matchPassword ? "hide" : "invalid"}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="Password"
              id="confirm_Password"
              onChange={(e) => setMatchPassword(e.target.value)}
              value={matchPassword}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first Password.
            </p>

            <button disabled={!validEmail || !validPassword || !validMatch}>
              Sign Up
            </button>

            <p>
              Already registered?
              <br />
              <span className="line">
                <Link to="/login">Sign In</Link>
              </span>
            </p>
          </form>
        </section>
      )}
    </>
  );
};

export default Register;
