import {  useContext } from "react";

import { AuthContext, type AuthContextType } from "../providers/AuthContext";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
