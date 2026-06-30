'use client';

import { createContext, useState, useEffect, useCallback, type ReactNode, useContext } from 'react';
import type { User, AuthState, LoginDto, RegisterDto } from '@/types/auth';
import { authService } from '@/services/auth-service';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<User>;
  register: (dto: RegisterDto) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setState({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const login = useCallback(async (dto: LoginDto): Promise<User> => {
  const res = await authService.login(dto);

  localStorage.setItem('token', res.accessToken);
  localStorage.setItem('user', JSON.stringify(res.user));
  setCookie('token', res.accessToken);

  setState({ user: res.user, token: res.accessToken, isAuthenticated: true, isLoading: false });
  
  // Dynamic redirect based on role
  if (res.user.role === 'SELLER') {
    window.location.href = '/seller';
  } else if (res.user.role === 'ADMIN') {
    window.location.href = '/admin';
  } else if (res.user.role === 'DELIVERY') {
    window.location.href = '/delivery';
  } else {
    window.location.href = '/buyer';
  }
  
  return res.user;
}, []);

  const register = useCallback(async (dto: RegisterDto): Promise<User> => {
    try {
      const res = await authService.register(dto);
      if (!res.user) throw new Error("No user data returned from registration");

      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('user', JSON.stringify(res.user));
      setCookie('token', res.accessToken);
      
      setState({ user: res.user, token: res.accessToken, isAuthenticated: true, isLoading: false });
      return res.user;
    } catch (error) {
      console.error("Registration failed in context:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout cleanup failed:", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      removeCookie('token');
      
      setState({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isLoading: false 
      });

      window.location.href = '/';
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}