import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../api/axios';
import { setAccessToken } from './tokenStore';

export type Role = 'ADMIN' | 'TRAINER' | 'STUDENT';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextValue {
  user: UserInfo | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    await api.post('/auth/register', data);
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    setAccessToken('');
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider');
  }
  return context;
}
