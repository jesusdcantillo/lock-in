import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authAPI } from "../services/api";
import type { LoginCredentials, RegisterData } from "../types";
import { AuthContext } from "./AuthContextDefinition";

export { AuthContext } from "./AuthContextDefinition";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token al cargar
    const token = localStorage.getItem("token");
    if (token) {
      authAPI
        .getProfile()
        .then((data) => {
          setUser({ username: data.user });
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const data = await authAPI.login(credentials);
    localStorage.setItem("token", data.access_token);
    setUser({ username: credentials.username });
    setIsAuthenticated(true);
  };

  const register = async (data: RegisterData) => {
    await authAPI.register(data);
    // Después del registro, hacer login automáticamente
    await login({ username: data.username, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
