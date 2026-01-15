import api from "./axios";

export const healthApi = {
  warmUp: async () => {
    try {
      await api.get("/health/warmup");
    } catch {
      // Silencioso a propósito: no rompemos UX
    }
  }
};
