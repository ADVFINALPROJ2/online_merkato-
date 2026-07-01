import api from './api';
import type { LoginDto, RegisterDto, AuthResponse } from '@/types/auth';

export const authService = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', dto);
    return data;
  },

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', dto);
    return data;
  },

  async logout(): Promise<void> {
  },

  async forgotPassword(dto: { email: string }): Promise<void> {
    await api.post('/auth/forgot-password', dto);
  },

  async resetPassword(dto: { token: string; password: string }): Promise<void> {
    await api.post('/auth/reset-password', dto);
  },
};
