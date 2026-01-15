import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { useAuth } from "@hooks/useAuth";
import { EmailInput } from "@components/auth/EmailInput";
import { PasswordInput } from "@components/auth/PasswordInput";
import { useEmailValidation } from "@hooks/useEmailValidation";
import { usePasswordValidation } from "@hooks/usePasswordValidation";
import DemoCredentials from "@components/auth/DemoCredentials";
import { healthApi } from "../api/healthApi";
const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const navigate = useNavigate();
  const { loginRequest, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const validEmail = useEmailValidation(email);
  const { isValid: validPassword } = usePasswordValidation(password);

  // Focus inicial
  useEffect(() => {
    emailRef.current?.focus();
    if (!sessionStorage.getItem("dbWarmedUp")) {
      healthApi.warmUp();
      sessionStorage.setItem("dbWarmedUp", "true");
    }
  }, []);

  // Manejo de submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validEmail || !validPassword) {
      errRef.current?.focus();
      return;
    }
    const success = await loginRequest(email, password, rememberMe);
    if (success) {
      navigate("/home");
    } else {
      errRef.current?.focus();
    }
  };

  return (
    <div className="auth-page">
      <section className="principal-container">
        <p
          ref={errRef}
          className={error ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {error}
        </p>

        <h1>Iniciar Sesión</h1>

        <form onSubmit={handleSubmit}>
          <EmailInput
            value={email}
            onChange={setEmail}
            isValid={validEmail}
            isAvailable={null}
            isChecking={false}
          />

          <PasswordInput
            label="Contraseña"
            passwordType="password"
            value={password}
            onChange={setPassword}
            isValid={validPassword}
          />

          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Recordarme</label>
          </div>

          <button
            className="action-btn"
            disabled={!validEmail || !validPassword || loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          <p>
            ¿Necesitas una cuenta?
            <br />
            <span className="line">
              <Link to="/register">Registrate</Link>
            </span>
          </p>
        </form>

        <DemoCredentials
          email="demo@yourapplication.com"
          password="Demo@1234"
          onFillCredentials={(email, password) => {
            setEmail(email);
            setPassword(password);
          }}
        />
      </section>
    </div>
  );
};

export default Login;
