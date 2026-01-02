import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isValid?: boolean;
  showValidation?: boolean;
};

export const PasswordInput = ({
  label,
  value,
  onChange,
  isValid = true,
  showValidation = false,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <label>
        {label}
        {showValidation && (
          <span className={isValid ? "valid" : "invalid"} />
        )}
      </label>

      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>
    </>
  );
};
