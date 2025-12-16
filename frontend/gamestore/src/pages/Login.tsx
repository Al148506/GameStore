import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { isAxiosError } from "axios";
import type { LoginRequestDto } from "../types/Auth/auth";
import type { JwtPayload } from "../types/Auth/jwt";
import "../styles/auth.css";
import { useAuth } from "@hooks/useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOGIN_URL = "/auth/login";

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  // Focus inicial
  useEffect(() => {
    emailRef.current?.focus();
  }, []);
  // Validaciones en tiempo real
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
    setValidPassword(password.length >= 8);
  }, [email, password]);
  // Limpia mensaje de error al cambiar email o password
  useEffect(() => {
    setErrMsg("");
  }, [email, password]);
  // Manejo de submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    if (!EMAIL_REGEX.test(email) || password.length < 8) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const payload: LoginRequestDto = { email, password };
      const response = await axios.post(LOGIN_URL, payload);
      const { accessToken } = response.data;
      
      const decoded: JwtPayload = jwtDecode(accessToken);
      const user = {
        id: decoded.sub,
        email: decoded.email,
        username: decoded.email.split("@")[0],
        role: decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ][0],
      };

      login(accessToken, user, rememberMe);
      navigate("/home");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (!err.response) setErrMsg("No Server Response");
        else if (err.response?.status === 401)
          setErrMsg("Invalid email or password");
        else setErrMsg("Login Failed");
      } else setErrMsg("An unexpected error occurred");
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
        <h1>Sign In</h1>
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
            id="email"
            ref={emailRef}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            aria-invalid={validEmail ? "false" : "true"}
            aria-describedby="emailnote"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
          />
          <p
            id="emailnote"
            className={
              emailFocus && email && !validEmail ? "instructions" : "offscreen"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} /> Must be a valid email
            address.
          </p>

          <label htmlFor="password">
            Password:
            <span className={!validPassword ? "hide" : "valid"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validPassword || !password ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="passwordnote"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <p
            id="passwordnote"
            className={
              passwordFocus && !validPassword ? "instructions" : "offscreen"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} /> Must be at least 8
            characters.
          </p>

          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <button
            className="action-btn"
            disabled={!validEmail || !validPassword}
          >
            Sign In
          </button>
          <p>
            Need an account?
            <br />
            <span className="line">
              <Link to="/register">Sign Up</Link>
            </span>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Login;
