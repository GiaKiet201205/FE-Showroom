import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthUser, LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';
import { UserAccount } from '../models/user.model';
import { UserService } from '../services/user/user.service';
import { MOCK_ADMIN_CREDENTIALS, isSoleAdmin } from '../services/auth.mock';

interface MockSession { token: string; user: AuthUser; expiresAt: number; credentialVersion?: number; }
interface LegacyAccount { user: AuthUser; password: string; }

@Injectable({ providedIn: 'root' })
export class MockAuthStore {
  private users = inject(UserService);
  private sessions = this.read<MockSession[]>('mock_sessions', []);

  constructor() {
    // Move previously registered accounts into the same directory as admin-managed Users.
    for (const account of this.read<LegacyAccount[]>('mock_accounts', [])) {
      if (account.user.email.toLowerCase() === MOCK_ADMIN_CREDENTIALS.email) continue;
      const profile = this.users.getSnapshot().find(user => user.email.toLowerCase() === account.user.email.toLowerCase());
      if (profile) {
        this.users.update(profile.id, { password: account.password }).subscribe();
      } else {
        this.users.create({ fullName: account.user.fullName, email: account.user.email, password: account.password,
          phone: '', registeredAt: new Date().toISOString(), role: 'user', status: 'active' }).subscribe();
      }
    }
    localStorage.removeItem('mock_accounts');
  }

  private read<T>(key: string, fallback: T): T {
    try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }
    catch { return fallback; }
  }
  emailAvailable(email: string): boolean {
    return !this.users.getSnapshot().some(user => user.email.toLowerCase() === email.trim().toLowerCase());
  }
  login(payload: LoginRequest): LoginResponse {
    const profile = this.users.authenticate(payload.email, payload.password);
    if (!profile) throw new HttpErrorResponse({ status: 401, error: { message: 'Email hoặc mật khẩu không đúng.' } });
    if (profile.status !== 'active') throw new HttpErrorResponse({ status: 403, error: { message: 'Tài khoản chưa hoạt động hoặc đã bị khoá.' } });
    const user = this.authUser(profile);
    const token = `mock-${crypto.randomUUID()}`;
    this.sessions = this.sessions.filter(session => session.expiresAt > Date.now());
    this.sessions.push({ token, user, expiresAt: Date.now() + 30 * 60 * 1000, credentialVersion: this.users.credentialVersion(profile.id) });
    localStorage.setItem('mock_sessions', JSON.stringify(this.sessions));
    return { accessToken: token, user };
  }
  register(payload: RegisterRequest): LoginResponse {
    if (!this.emailAvailable(payload.email)) throw new HttpErrorResponse({ status: 409, error: { message: 'Email đã được sử dụng.' } });
    if (!payload.fullName.trim() || payload.password.length < 6) throw new HttpErrorResponse({ status: 400, error: { message: 'Thông tin đăng ký không hợp lệ.' } });
    let createError: Error | undefined;
    this.users.create({ fullName: payload.fullName.trim(), email: payload.email, phone: payload.phone,
      password: payload.password, registeredAt: new Date().toISOString(), role: 'user', status: 'active'
    }).subscribe({ error: error => createError = error });
    if (createError) throw createError;
    return this.login(payload);
  }
  sessionUser(token: string | null): AuthUser | null {
    const session = this.sessions.find(session => session.token === token && session.expiresAt > Date.now());
    if (!session) return null;
    const profile = this.users.getSnapshot().find(user => user.id === session.user.id);
    if (!profile || profile.email !== session.user.email || profile.status !== 'active' || this.users.credentialVersion(profile.id) !== (session.credentialVersion ?? 0)) return null;
    return this.authUser(profile);
  }
  isAdminToken(header: string | null): boolean {
    return !!header?.startsWith('Bearer ') && isSoleAdmin(this.sessionUser(header.slice(7)));
  }
  revokeSession(token: string | null): void {
    this.sessions = this.sessions.filter(session => session.token !== token);
    localStorage.setItem('mock_sessions', JSON.stringify(this.sessions));
  }
  private authUser(profile: UserAccount): AuthUser {
    return { id: profile.id, fullName: profile.fullName, email: profile.email,
      role: isSoleAdmin(profile) ? 'admin' : 'user', ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}) };
  }
}
