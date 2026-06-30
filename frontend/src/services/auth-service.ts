import api from './api';
import type { LoginDto, RegisterDto, AuthResponse, ForgotPasswordDto, ResetPasswordDto, RefreshTokenDto } from '@/types/auth';

export const authService = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', dto);
    return data;
  },

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', dto);
    return data;
  },

  async refresh(dto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken?: string }> {
    const { data } = await api.post<{ accessToken: string; refreshToken?: string }>('/api/auth/refresh', dto);
    return data;
  },

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/api/auth/forgot-password', dto);
    return data;
  },

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/api/auth/reset-password', dto);
    return data;
  },
};
