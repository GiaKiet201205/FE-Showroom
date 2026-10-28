import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { UserAccount, UserAccountInput, UserAccountChanges, UserListResult } from '../../models/user.model';
import { MOCK_CURRENT_USER, MOCK_USERS, MOCK_USER_STATS } from './user.mock';
import { MOCK_ADMIN_CREDENTIALS, MOCK_ADMIN_LOGIN_RESPONSE } from '../auth.mock';

export interface UserQuery {
  search?: string;
  role?: string;
  status?: string;
  page: number;
  pageSize: number;
}
interface StoredDirectory {
  users: UserAccount[];
  passwords: Record<number, string>;
  versions: Record<number, number>;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly storageKey = 'mock_user_directory';
  private bookingUsers = new Set<number>();
  private users: UserAccount[] = MOCK_USERS.map(user => ({ ...user }));
  private passwords: Record<number, string> = {};
  private versions: Record<number, number> = {};
  private currentUser: UserAccount = { ...MOCK_CURRENT_USER };

  constructor() {
    try {
      const saved: StoredDirectory | null = JSON.parse(localStorage.getItem(this.storageKey) ?? 'null');
      if (saved && Array.isArray(saved.users)) {
        this.users = saved.users.filter(user => user.id !== 1 && user.email.toLowerCase() !== MOCK_ADMIN_CREDENTIALS.email)
          .map(user => ({ ...user, role: user.role === 'admin' ? 'user' : user.role }));
        this.users.unshift({ ...MOCK_USERS[0] });
        this.passwords = saved.passwords ?? {};
        this.versions = saved.versions ?? {};
      }
    } catch { /* Use seed data when no valid directory is stored. */ }
    for (const user of this.users) {
      this.passwords[user.id] ??= user.role === 'seller' ? 'seller123' : 'user123';
      this.versions[user.id] ??= 0;
    }
    this.passwords[1] = MOCK_ADMIN_CREDENTIALS.password;
    this.currentUser = { ...(this.users.find(user => user.id === MOCK_CURRENT_USER.id) ?? MOCK_CURRENT_USER) };
  }

  getSnapshot(): UserAccount[] { return this.users.map(user => ({ ...user })); }
  retainForBooking(id: number): void { this.bookingUsers.add(id); }
  /** Current plaintext value for the local mock administration form only. */
  getMockPassword(id: number): string {
    return this.users.some(user => user.id === id) ? this.passwords[id] ?? '' : '';
  }
  credentialVersion(id: number): number { return this.versions[id] ?? 0; }
  authenticate(email: string, password: string): UserAccount | null {
    const user = this.users.find(user => user.email.toLowerCase() === email.trim().toLowerCase());
    return user && this.passwords[user.id] === password ? { ...user } : null;
  }
  getCurrentUser(): Observable<UserAccount> { return of({ ...this.currentUser }); }

  updateCurrentUser(changes: UserAccountChanges): Observable<UserAccount> {
    return this.update(this.currentUser.id, { ...changes, id: this.currentUser.id });
  }

  getList(query: UserQuery): Observable<UserListResult> {
    const search = query.search?.trim().toLowerCase();
    const result = this.users.filter(user =>
      (!search || [user.fullName, user.email, user.phone].some(value => value.toLowerCase().includes(search))) &&
      (!query.role || query.role === 'all' || user.role === query.role) &&
      (!query.status || query.status === 'all' || user.status === query.status));
    const start = (query.page - 1) * query.pageSize;
    const now = new Date();
    return of({
      items: result.slice(start, start + query.pageSize).map(user => ({ ...user })),
      total: result.length, page: query.page, pageSize: query.pageSize,
      stats: {
        ...MOCK_USER_STATS, totalUsers: this.users.length,
        activeUsers: this.users.filter(user => user.status === 'active').length,
        blockedUsers: this.users.filter(user => user.status === 'blocked').length,
        newThisMonth: this.users.filter(user => {
          const date = new Date(user.registeredAt);
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length
      }
    });
  }

  create(input: UserAccountInput): Observable<UserAccount> {
    const error = this.validateChanges(input);
    if (error) return throwError(() => new Error(error));
    const { password, ...profile } = input;
    const user: UserAccount = {
      ...profile, id: Math.max(0, ...this.users.map(user => user.id)) + 1,
      email: input.email.trim().toLowerCase(), registeredAt: input.registeredAt || new Date().toISOString()
    };
    this.users = [...this.users, user];
    this.passwords[user.id] = password || (user.role === 'seller' ? 'seller123' : 'user123');
    this.versions[user.id] = 0;
    this.persist();
    return of({ ...user });
  }

  update(id: number, changes: UserAccountChanges): Observable<UserAccount> {
    if (id === MOCK_ADMIN_LOGIN_RESPONSE.user.id) return this.adminProtected();
    const error = this.validateChanges(changes, id);
    if (error) return throwError(() => new Error(error));
    const current = this.users.find(user => user.id === id);
    if (!current) return throwError(() => new Error('Không tìm thấy dữ liệu.'));
    if (this.bookingUsers.has(id) && changes.role && changes.role !== current.role) {
      return throwError(() => new Error('Không thể đổi vai trò người dùng đã có lịch lái thử.'));
    }
    const { password, ...profile } = changes;
    const updated: UserAccount = { ...current, ...profile, id, email: changes.email?.trim().toLowerCase() ?? current.email };
    this.users = this.users.map(user => user.id === id ? updated : user);
    if (password) {
      this.passwords[id] = password;
      this.versions[id] = this.credentialVersion(id) + 1;
    }
    if (id === this.currentUser.id) this.currentUser = { ...updated };
    this.persist();
    return of({ ...updated });
  }

  delete(id: number): Observable<void> {
    if (id === 1) return this.adminProtected();
    if (this.bookingUsers.has(id)) return throwError(() => new Error('Người dùng đang được liên kết với lịch lái thử; không thể xoá hoặc khoá.'));
    this.users = this.users.filter(user => user.id !== id);
    delete this.passwords[id];
    delete this.versions[id];
    this.persist();
    return of(undefined);
  }

  toggleBlock(id: number): Observable<void> {
    if (id === 1) return this.adminProtected();
    if (this.bookingUsers.has(id)) return throwError(() => new Error('Người dùng đang được liên kết với lịch lái thử; không thể xoá hoặc khoá.'));
    this.users = this.users.map(user => user.id === id ? { ...user, status: user.status === 'blocked' ? 'active' : 'blocked' } : user);
    this.persist();
    return of(undefined);
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify({ users: this.users, passwords: this.passwords, versions: this.versions }));
  }
  private adminProtected(): Observable<never> {
    return throwError(() => new Error('Tài khoản quản trị duy nhất không thể sửa, xoá hoặc khoá.'));
  }
  private validateChanges(changes: UserAccountChanges, id?: number): string | null {
    if (changes.password && changes.password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
    if (changes.role !== undefined && !['user', 'seller'].includes(changes.role)) return 'Chỉ được tạo hoặc cập nhật tài khoản User và Seller.';
    if (changes.email !== undefined) {
      const email = changes.email.trim().toLowerCase();
      if (email === MOCK_ADMIN_CREDENTIALS.email || this.users.some(user => user.id !== id && user.email.toLowerCase() === email)) {
        return 'Email đã được sử dụng hoặc dành riêng cho quản trị viên.';
      }
    }
    return null;
  }
}
