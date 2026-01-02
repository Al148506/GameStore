import { useEffect, useState } from "react";
import { PASSWORD_RULES } from "../constants/userCreationValidations";

export const usePasswordValidation = (
  password: string,
  confirmPassword?: string
) => {
  const [rules, setRules] = useState({
    minLength: false,
    hasUppercase: false,
    hasDigit: false,
    hasNonAlphanumeric: false,
  });

  const [isValid, setIsValid] = useState(false);
  const [match, setMatch] = useState(false);

  useEffect(() => {
    const nextRules = {
      minLength: password.length >= PASSWORD_RULES.minLength,
      hasUppercase: PASSWORD_RULES.hasUppercase.test(password),
      hasDigit: PASSWORD_RULES.hasDigit.test(password),
      hasNonAlphanumeric: PASSWORD_RULES.hasNonAlphanumeric.test(password),
    };

    setRules(nextRules);

    setIsValid(Object.values(nextRules).every(Boolean));

    if (confirmPassword !== undefined) {
      setMatch(password === confirmPassword && confirmPassword.length > 0);
    }
  }, [password, confirmPassword]);

  return {
    rules,
    isValid,
    match,
  };
};
