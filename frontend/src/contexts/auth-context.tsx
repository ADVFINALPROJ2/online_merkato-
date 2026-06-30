'use client';

import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, AuthState, LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto, RefreshTokenDto } from '@/types/auth';
import { authService } from '@/services/auth-service';

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export interface AuthContextType extends AuthState {
  login: (dto: LoginDto) => Promise<User>;
  register: (dto: RegisterDto) => Promise<User>;
  refreshToken: (dto: RefreshTokenDto) => Promise<void>;
  forgotPassword: (dto: ForgotPasswordDto) => Promise<void>;
  resetPassword: (dto: ResetPasswordDto) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setState({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        setState((s) => ({ ...s, isLoading: false }));
      }
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (dto: LoginDto) => {
    const res = await authService.login(dto);
    localStorage.setItem('token', res.accessToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('refreshToken', res.refreshToken || '');
    setCookie('token', res.accessToken);
    setState({ user: res.user, token: res.accessToken, isAuthenticated: true, isLoading: false });
    return res.user;
  }, []);

  const register = useCallback(async (dto: RegisterDto) => {
    const res = await authService.register(dto);
    localStorage.setItem('token', res.accessToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    if (res.refreshToken) {
      localStorage.setItem('refreshToken', res.refreshToken);
    }
    setCookie('token', res.accessToken);
    setState({ user: res.user, token: res.accessToken, isAuthenticated: true, isLoading: false });
    return res.user;
  }, []);

  const refreshToken = useCallback(async (dto: RefreshTokenDto) => {
    const res = await authService.refresh(dto);
    localStorage.setItem('token', res.accessToken);
    if (res.refreshToken) {
      localStorage.setItem('refreshToken', res.refreshToken);
    }
    setCookie('token', res.accessToken);
    setState((s) => ({ ...s, token: res.accessToken }));
  }, []);

  const forgotPassword = useCallback(async (dto: ForgotPasswordDto) => {
    await authService.forgotPassword(dto);
  }, []);

  const resetPassword = useCallback(async (dto: ResetPasswordDto) => {
    await authService.resetPassword(dto);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    removeCookie('token');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, refreshToken, forgotPassword, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
