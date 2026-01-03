import { useEffect, useState } from "react";
import { EMAIL_REGEX } from "../constants/userCreationValidations";
export function useEmailValidation(email: string): boolean {
  const [isValid, setIsValid] = useState(false);    
    useEffect(() => {
        setIsValid(EMAIL_REGEX.test(email));
    }, [email]);

    return isValid;
}