import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
type Props = {
  label: string;
  passwordType: string;
  value: string;
  onChange: (value: string) => void;
  isValid?: boolean;
  rules?: {
    minLength: boolean;
    hasUppercase: boolean;
    hasDigit: boolean;
    hasNonAlphanumeric: boolean;
  };
};
import "../../styles/passwordInput.css";

export const PasswordInput = ({
  label,
  passwordType,
  value,
  onChange,
  isValid,
}: Props) => {
  const [focus, setFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input">
      <label>
        {label}
        <span className={isValid ? "valid" : "hide"}>
          <FontAwesomeIcon icon={faCheck} />
        </span>
        <span className={!isValid && value ? "invalid" : "hide"}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
      </label>

      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          id={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          aria-invalid={!isValid}
          aria-describedby="passwordnote"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
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
        className={focus && value && !isValid ? "instructions" : "offscreen"}
      >
        <FontAwesomeIcon icon={faInfoCircle} />
        {passwordType === "password" || passwordType === "newPassword" ? (
          <>
            Tu contraseña debe cumplir con los siguientes criterios:
            <br />
            - Tener al menos 8 caracteres
            <br />
            - Contener al menos una letra mayúscula
            <br />
            - Contener al menos un número
            <br />- Contener al menos un carácter especial
          </>
        ) : (
          "Por favor asegurate de que tus contraseñas coinciden."
        )}
      </p>
    </div>
  );
};
