import { useContext } from "react";
import { AuthContext } from "../services/auth/AuthContext"

export function useAuth() {
  return useContext(AuthContext);
}
