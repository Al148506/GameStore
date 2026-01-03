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

export const PasswordInput = ({ label, value, onChange, isValid }: Props) => {
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
        {label === "Password" || label === "Nueva contraseña" ? (
          <>
            Your password must meet the following criteria:
            <br />
            - At least 8 characters long
            <br />
            - Contains at least one uppercase letter
            <br />
            - Contains at least one digit
            <br />- Contains at least one special character
          </>
        ) : (
          "Please make sure the passwords match."
        )}
      </p>
    </div>
  );
};
