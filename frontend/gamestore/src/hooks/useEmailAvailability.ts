import { useEffect, useState } from "react";
import { authApi } from "../api/authApi";

export const useEmailAvailability = (email: string, isValidEmail: boolean) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    if (!email || !isValidEmail) {
      setIsAvailable(null);
      return;
    }
    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        setIsChecking(true);
        const res = authApi.checkEmailAvailability(email, controller.signal);
        setIsAvailable(!(await res).data.exists);
      } catch {
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [email, isValidEmail]);

  return { isAvailable, isChecking };
};
