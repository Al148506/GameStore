import {
  faCheck,
  faTimes,
  faInfoCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
  isAvailable: boolean | null;
  isChecking: boolean;
};

export const EmailInput = ({
  value,
  onChange,
  isValid,
  isAvailable,
  isChecking,
}: Props) => {
  const [focus, setFocus] = useState(false);
  const showFormatError = value && !isValid;
  const showAvailabilityError = isValid && isAvailable === false;
  const isSuccess = isValid && isAvailable === true;
  return (
    <>
      <label htmlFor="email">
        Email:
        {isSuccess && (
          <span className="valid">
            <FontAwesomeIcon icon={faCheck} />
          </span>
        )}
        {(showFormatError || showAvailabilityError) && (
          <span className="invalid">
            <FontAwesomeIcon icon={faTimes} />
          </span>
        )}
        {isChecking && (
          <span className="checking">
            <FontAwesomeIcon icon={faSpinner} spin />
          </span>
        )}
      </label>

      <input
        type="email"
        id="email"
        autoComplete="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        aria-invalid={showFormatError || showAvailabilityError}
        aria-describedby="emailnote"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />

      {/* Formato inválido */}
      <p
        id="emailnote"
        className={focus && showFormatError ? "instructions" : "offscreen"}
      >
        <FontAwesomeIcon icon={faInfoCircle} />
        Debe ser un correo electrónico válido.
      </p>

      {/* Email ya registrado */}
      {showAvailabilityError && (
        <p className="errmsg">Este correo ya está registrado.</p>
      )}
    </>
  );
};
