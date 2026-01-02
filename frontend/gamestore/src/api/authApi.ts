import api from "./axios";
import type { LoginRequestDto, RegisterRequestDto } from "../types/auth/auth";

export const authApi = {
  login: (payload: LoginRequestDto) => api.post("/auth/login", payload),

  register: (payload: RegisterRequestDto) =>
    api.post("/auth/register", payload),
};
