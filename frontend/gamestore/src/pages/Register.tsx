import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EmailInput } from "@components/auth/EmailInput";
import { PasswordInput } from "@components/auth/PasswordInput";
import { useAuth } from "@hooks/useAuth";
import { usePasswordValidation } from "@hooks/usePasswordValidation";
import { useEmailValidation } from "@hooks/useEmailValidation";
import { useEmailAvailability } from "@hooks/useEmailAvailability";
import Swal from "sweetalert2";
import "../styles/auth.css";
import { useServerWarmUp } from "@hooks/useServerWarmUp";
const Register = () => {
  const errRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();
  const { registerRequest, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const validEmail = useEmailValidation(email);
  const { isAvailable, isChecking } = useEmailAvailability(email, validEmail);
  const { isWarmingUp } = useServerWarmUp();

  const {
    rules,
    isValid: validPassword,
    match: passwordMatch,
  } = usePasswordValidation(password, confirmPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await registerRequest(email, password);
    if (success) {
      await Swal.fire({
        title: "Registro Exitoso",
        text: "Tu cuenta ha sido registrada exitosamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      navigate("/login");
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

        <h1>Registro</h1>

        <form onSubmit={handleSubmit}>
          <EmailInput
            value={email}
            onChange={setEmail}
            isValid={validEmail}
            isAvailable={isAvailable}
            isChecking={isChecking}
          />

          <PasswordInput
            label="Contraseña"
            passwordType="password"
            value={password}
            onChange={setPassword}
            isValid={validPassword}
            rules={rules}
          />

          <PasswordInput
            label="Confirmar contraseña"
            passwordType="confirmPassword"
            value={confirmPassword}
            onChange={setConfirmPassword}
            isValid={passwordMatch}
          />

          <button
            className="action-btn"
            disabled={
              !validEmail || !validPassword || !passwordMatch || loading
            }
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          {isWarmingUp && (
            <p className="warmup-info">
              Preparando el servidor, esto puede tardar unos segundos…
            </p>
          )}

          <p>
            ¿Ya tienes una cuenta?
            <br />
            <span className="line">
              <Link to="/login">Inicia sesión</Link>
            </span>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Register;
