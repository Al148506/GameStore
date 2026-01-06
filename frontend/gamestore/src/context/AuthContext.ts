import { createContext } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  loginRequest: (
    email: string,
    password: string,
    remember: boolean
  ) => Promise<boolean>;

  registerRequest: (email: string, password: string) => Promise<boolean>;

  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
