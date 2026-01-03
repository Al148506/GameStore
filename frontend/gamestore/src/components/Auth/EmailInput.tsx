import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
};

export const EmailInput = ({ value, onChange, isValid }: Props) => {
  const [focus, setFocus] = useState(false);

  return (
    <>
      <label htmlFor="email">
        Email:
        <span className={isValid ? "valid" : "hide"}>
          <FontAwesomeIcon icon={faCheck} />
        </span>
        <span className={!isValid && value ? "invalid" : "hide"}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
      </label>

      <input
        type="email"
        id="email"
        autoComplete="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        aria-invalid={!isValid}
        aria-describedby="emailnote"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />

      <p
        id="emailnote"
        className={focus && value && !isValid ? "instructions" : "offscreen"}
      >
        <FontAwesomeIcon icon={faInfoCircle} />
        Must be a valid email address.
      </p>
    </>
  );
};
