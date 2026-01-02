import { createContext } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;

  loginRequest: (
    email: string,
    password: string,
    remember: boolean
  ) => Promise<boolean>;

  registerRequest: (
    email: string,
    password: string
  ) => Promise<boolean>;

  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
