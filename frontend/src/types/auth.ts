export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  password: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN' | 'DELIVERY';
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
  refreshToken?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
