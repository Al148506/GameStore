import api from "./axios";
import type { LoginRequestDto, RegisterRequestDto } from "../types/Auth/auth";

export const authApi = {
  login: (payload: LoginRequestDto) => api.post("/auth/login", payload),

  register: (payload: RegisterRequestDto) =>
    api.post("/auth/register", payload),
};
