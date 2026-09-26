export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
