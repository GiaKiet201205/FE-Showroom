import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthUser, LoginRequest, LoginResponse } from '../models/auth.model';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * AuthService chịu trách nhiệm toàn bộ logic đăng nhập/đăng xuất/phiên làm việc.
 * Dùng Signal (thay vì Observable) vì đây là state đơn giản, đọc đồng bộ,
 * nhiều nơi trong UI (sidebar, topbar, guard) cần đọc trực tiếp giá trị hiện tại.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // Signal riêng tư, chỉ AuthService được phép ghi
  private currentUserSignal = signal<AuthUser | null>(this.readUserFromStorage());

  // Signal chỉ-đọc để component/guard bên ngoài dùng, không thể gán đè
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/login', payload).pipe(
      tap((res) => this.setSession(res))
    );
  }

  loginAsAdmin(): void {
    this.setSession({
      accessToken: 'demo-token',
      user: {
        id: 1,
        fullName: 'Alex Mercer',
        email: 'admin@autodrive.dev',
        role: 'admin'
      }
    });
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
