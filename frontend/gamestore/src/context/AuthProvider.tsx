import { useMemo, useState, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import { authApi } from "../api/authApi";
import type { AxiosError } from "axios";
import { clearAuthStorage } from "@utils/clearAuthStorage";
import { clearCartStorage } from "@utils/clearCartStorage";

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
     DERIVED STATE 
  ========================= */

  const isAuthenticated = !!token && !!user;

  const isAdmin = useMemo(() => {
    if (!user) return false;

    if ("roles" in user && Array.isArray(user.roles)) {
      return user.roles.includes("Admin");
    }
    return false;
  }, [user]);

  /* =========================
      REGISTER
  ========================= */
  const registerRequest = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await authApi.register({
        email,
        password,
      });
      return true;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Registration error:", error);
      setError(error.response?.data?.message ?? "Error during registration");
      return false;
    } finally {
      setLoading(false);
    }
  };

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

    const maxRetries = 2; // ⬅️ 2 reintentos
    const retryDelay = 3000; // ⬅️ 3 segundos

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const shouldRetry = (error: AxiosError) => {
      // Reintentar solo en errores típicos de cold start
      return (
        error.code === "ECONNABORTED" ||
        error.code === "ERR_NETWORK" ||
        error.response?.status === 500
      );
    };
    try {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
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

          return true; // ✅ éxito
        } catch (err) {
          const error = err as AxiosError<{ message: string }>;

          if (attempt < maxRetries && shouldRetry(error)) {
            await sleep(retryDelay);
            continue; // ⬅️ reintentar
          }
          setError(error.response?.data?.message ?? "Credenciales incorrectas");
        }
      }
      return false;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      console.error("Login error:", error);

      setError(
        error.response?.data?.message ??
          "El servidor está iniciando, intenta de nuevo en unos segundos"
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  /* =========================
      LOGOUT
  ========================= */

  const logout = () => {
    clearAuthStorage();
    clearCartStorage();
    setToken(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        loginRequest,
        registerRequest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
