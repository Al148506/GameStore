import api from "@shared/api/httpClient";
import type { LoginRequestDto, RegisterRequestDto } from "../types/auth";

export const authApi = {
  login: (payload: LoginRequestDto) => 
    api.post("/auth/login", payload),

  register: (payload: RegisterRequestDto) =>
    api.post("/auth/register", payload),

  checkEmailAvailability: (email: string,  signal?: AbortSignal) =>
    api.get("/auth/check-email", {
      params: { email },
      signal,
    }),
};
