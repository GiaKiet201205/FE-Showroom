import { Injectable, computed, signal } from '@angular/core';
import { Observable, of, tap, throwError } from 'rxjs';
import { AuthUser, LoginRequest, LoginResponse } from '../models/auth.model';
import { MOCK_ADMIN_CREDENTIALS, MOCK_ADMIN_LOGIN_RESPONSE } from './auth.mock';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSignal = signal<AuthUser | null>(this.readUserFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  login(payload: LoginRequest): Observable<LoginResponse> {
    const isValidCredentials =
      payload.email === MOCK_ADMIN_CREDENTIALS.email &&
      payload.password === MOCK_ADMIN_CREDENTIALS.password;

    if (!isValidCredentials) {
      return throwError(() => new Error('Email hoặc mật khẩu không đúng.'));
    }

    return of(MOCK_ADMIN_LOGIN_RESPONSE).pipe(tap((res) => this.setSession(res)));
  }

  loginAsAdmin(): void {
    this.setSession(MOCK_ADMIN_LOGIN_RESPONSE);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setSession(res: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.currentUserSignal.set(res.user);
  }

  private readUserFromStorage(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }
}
