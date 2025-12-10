import { useState, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";

function getStoredUser(): User | null {
  try {
    const local = localStorage.getItem("user");
    const session = sessionStorage.getItem("user");

    const raw = session ?? local;

    if (!raw) return null;
    if (raw === "undefined" || raw === "null") return null; // ⬅️ prevenir error

    return JSON.parse(raw) as User;
  } catch {
    return null; // ⬅️ si falla el parseo, retornar null seguro
  }
}

function getStoredToken(): string | null {
  const local = localStorage.getItem("token");
  const session = sessionStorage.getItem("token");

  const raw = session ?? local;
  if (!raw || raw === "undefined" || raw === "null") return null;

  return raw;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const login = (token: string, user: User, remember: boolean) => {
    setToken(token);
    setUser(user);

    const userStr = JSON.stringify(user);

    if (remember) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", userStr);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", userStr);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
