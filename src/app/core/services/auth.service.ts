import { isSoleAdmin } from './auth.mock';
import { MockAuthStore } from '../mock/mock-auth.store';
import { Injectable, computed, signal, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthUser, LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private mockAuth = inject(MockAuthStore);
  private currentUserSignal = signal<AuthUser | null>(this.readUserFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(() => isSoleAdmin(this.currentUserSignal()));

  private http = inject(HttpClient);

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/login', payload).pipe(tap(res => this.setSession(res)));
  }
  register(payload: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/register', payload).pipe(tap(res => this.setSession(res)));
  }
  emailAvailable(email: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>('/auth/email-available', { params: { email } });
  }
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/auth/forgot-password', { email });
  }

  logout(): void {
    this.mockAuth.revokeSession(this.getToken());
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
  }

  canAccessAdmin(): boolean {
    return isSoleAdmin(this.mockAuth.sessionUser(this.getToken()));
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
    return this.mockAuth.sessionUser(localStorage.getItem(TOKEN_KEY));
  }
}
