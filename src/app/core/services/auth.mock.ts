import { LoginRequest, LoginResponse } from '../models/auth.model';

export const MOCK_ADMIN_CREDENTIALS: LoginRequest = {
  email: 'admin@giakiet.com',
  password: 'admin123'
};

export const MOCK_ADMIN_LOGIN_RESPONSE: LoginResponse = {
  accessToken: 'demo-token',
  user: {
    id: 1,
    fullName: 'Alex Mercer',
    email: MOCK_ADMIN_CREDENTIALS.email,
    role: 'admin'
  }
};

/** The application has exactly one fixed administrator identity. */
export function isSoleAdmin(user: { id: number; email: string; role: string } | null | undefined): boolean {
  return user?.id === MOCK_ADMIN_LOGIN_RESPONSE.user.id &&
    user.email.toLowerCase() === MOCK_ADMIN_CREDENTIALS.email && user.role === 'admin';
}
