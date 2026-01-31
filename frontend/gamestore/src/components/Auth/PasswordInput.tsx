import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/passwordInput.css";

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

export const PasswordInput = ({
  label,
  passwordType,
  value,
  onChange,
  isValid,
  rules,
}: Props) => {
  const [focus, setFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const showInstructions = focus && value && !isValid;
  const isPasswordField = passwordType === "password" || passwordType === "newPassword";

  return (
    <div className="password-input">
      <label htmlFor={`password-${label}`} className="password-label">
        <span className="label-text">{label}</span>
        
        <span className="validation-icons">
          {isValid && (
            <span className="validation-icon valid" aria-label="Válido">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          )}
          {!isValid && value && (
            <span className="validation-icon invalid" aria-label="Inválido">
              <FontAwesomeIcon icon={faTimes} />
            </span>
          )}
        </span>
      </label>

      <div className="password-field">
        <input
          type={showPassword ? "text" : "password"}
          id={`password-${label}`}
          className={`password-input-field ${!isValid && value ? 'invalid-input' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          aria-invalid={!isValid}
          aria-describedby={`${label}-note`}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder="Ingresa tu contraseña"
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          tabIndex={-1}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>

      <div 
        id={`${label}-note`}
        className={`password-instructions ${showInstructions ? 'visible' : ''}`}
        role="alert"
        aria-live="polite"
      >
        <div className="instructions-header">
          <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
          <span className="instructions-title">
            {isPasswordField ? 'Requisitos de contraseña' : 'Confirmación de contraseña'}
          </span>
        </div>

        {isPasswordField && rules ? (
          <ul className="requirements-list">
            <li className={rules.minLength ? 'met' : 'unmet'}>
              <FontAwesomeIcon icon={rules.minLength ? faCheck : faTimes} />
              <span>Mínimo 8 caracteres</span>
            </li>
            <li className={rules.hasUppercase ? 'met' : 'unmet'}>
              <FontAwesomeIcon icon={rules.hasUppercase ? faCheck : faTimes} />
              <span>Una letra mayúscula</span>
            </li>
            <li className={rules.hasDigit ? 'met' : 'unmet'}>
              <FontAwesomeIcon icon={rules.hasDigit ? faCheck : faTimes} />
              <span>Un número</span>
            </li>
            <li className={rules.hasNonAlphanumeric ? 'met' : 'unmet'}>
              <FontAwesomeIcon icon={rules.hasNonAlphanumeric ? faCheck : faTimes} />
              <span>Un carácter especial</span>
            </li>
          </ul>
        ) : (
          <p className="confirmation-text">
            Asegúrate de que ambas contraseñas coincidan
          </p>
        )}
      </div>
    </div>
  );
};