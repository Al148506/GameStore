import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EmailInput } from "@components/auth/EmailInput";
import { PasswordInput } from "@components/auth/PasswordInput";
import { useAuth } from "@hooks/useAuth";
import { usePasswordValidation } from "@hooks/usePasswordValidation";
import { useEmailValidation } from "@hooks/useEmailValidation";
import Swal from "sweetalert2";
import "../styles/auth.css";
const Register = () => {
  const errRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();
  const { registerRequest, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const validEmail = useEmailValidation(email);
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

        <h1>Sign Up</h1>

        <form onSubmit={handleSubmit}>
          <EmailInput value={email} onChange={setEmail} isValid={validEmail} />

          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            isValid={validPassword}
            rules={rules}
          />

          <PasswordInput
            label="Confirm Password"
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
            {loading ? "Signing Up..." : "Sign Up"}
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
