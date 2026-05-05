/**
 * AuthContext.jsx
 * Contexto global de autenticação
 * Fornece usuário logado, funções de login/logout e estado de carregamento
 */

import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recupera usuário da sessão ao montar
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleRegister = async (email, senha, nome) => {
    setError(null);
    try {
      const newUser = await authService.register(email, senha, nome);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleLogin = async (email, senha) => {
    setError(null);
    try {
      const loggedUser = await authService.login(email, senha);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: user !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook customizado para usar AuthContext
 * @returns {Object} { user, loading, error, register, login, logout, isAuthenticated }
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
