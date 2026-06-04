import { useEffect, useState } from "react";
import { healthApi } from "@shared/api/healthApi";

export const useServerWarmUp = () => {
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [hasWarmedUp, setHasWarmedUp] = useState(false);

  useEffect(() => {
    const warmUp = async () => {
      // Evita repetir warm-up en la misma sesión
      if (sessionStorage.getItem("dbWarmedUp")) {
        setHasWarmedUp(true);
        return;
      }

      setIsWarmingUp(true);

      try {
        await healthApi.warmUp();
        sessionStorage.setItem("dbWarmedUp", "true");
        setHasWarmedUp(true);
      } catch {
        // No bloqueamos: login/register tienen retry
        console.warn("Warm-up failed, relying on retry");
      } finally {
        setIsWarmingUp(false);
      }
    };
    warmUp(); // 👈 se ejecuta automáticamente al render
  }, []);

  return {
    isWarmingUp,
    hasWarmedUp,
  };
};
