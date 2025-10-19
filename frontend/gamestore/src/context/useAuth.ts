import { createContext } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  // Add other user properties as needed
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);