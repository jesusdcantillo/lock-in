import { createContext } from "react";
import type { LoginCredentials, RegisterData } from "../types";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string } | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
