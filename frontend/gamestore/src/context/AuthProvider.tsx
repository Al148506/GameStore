import { useState, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import { authApi } from "../api/authApi";
import type { AxiosError } from "axios";



/* =========================
   Helpers de almacenamiento
========================= */
function getStoredUser(): User | null {
  try {
    const local = localStorage.getItem("user");
    const session = sessionStorage.getItem("user");
    const raw = session ?? local;

    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function getStoredToken(): string | null {
  const local = localStorage.getItem("token");
  const session = sessionStorage.getItem("token");
  const raw = session ?? local;

  if (!raw || raw === "undefined" || raw === "null") return null;
  return raw;
}

/* =========================
   AuthProvider
========================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     LOGIN 
  ========================= */

  const loginRequest = async (
    email: string,
    password: string,
    remember: boolean
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login({
        email,
        password,
      });

      const { accessToken, user } = response.data;

      setToken(accessToken);
      setUser(user);

      const userStr = JSON.stringify(user);

      if (remember) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", userStr);
        sessionStorage.clear();
      } else {
        sessionStorage.setItem("token", accessToken);
        sessionStorage.setItem("user", userStr);
        localStorage.clear();
      }

      return true;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      console.error("Login error:", error);

      setError(
        error.response?.data?.message ??
          "Credenciales incorrectas o error de servidor"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

const logout = () => {
  setToken(null);
  setUser(null);

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};


  return (
    <AuthContext.Provider
      value={{ token, user, loading, error, loginRequest, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
