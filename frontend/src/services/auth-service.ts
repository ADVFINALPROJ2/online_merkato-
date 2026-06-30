// src/services/auth-service.ts
import api from './api';
import type { LoginDto, RegisterDto, AuthResponse } from '@/types/auth';

export const authService = {
  // Add this login method
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', dto);
    return data;
  },

  // Ensure this register method exists
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', dto);
    return data;
  },

  async logout(): Promise<void> {
    // Add logout logic if needed
  },

  async forgotPassword(dto: { email: string }): Promise<void> {
    await api.post('/auth/forgot-password', dto);
  },

  async resetPassword(dto: { token: string; password: string }): Promise<void> {
    await api.post('/auth/reset-password', dto);
  },
};
