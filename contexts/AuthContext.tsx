import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    lastLoginTime: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedAuth = authService.getAuthState();
    setAuthState(storedAuth);
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const result = await authService.login(credentials);
    if (result.success) {
      setAuthState(authService.getAuthState());
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setAuthState({ isAuthenticated: false, user: null, lastLoginTime: null });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
