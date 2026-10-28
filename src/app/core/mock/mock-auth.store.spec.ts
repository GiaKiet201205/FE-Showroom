import { TestBed } from '@angular/core/testing';
import { MockAuthStore } from './mock-auth.store';
import { MOCK_ADMIN_CREDENTIALS, MOCK_ADMIN_LOGIN_RESPONSE } from '../services/auth.mock';

describe('Single administrator authentication', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('allows only the fixed admin session to access administration', () => {
    const store = TestBed.inject(MockAuthStore);
    const admin = store.login(MOCK_ADMIN_CREDENTIALS);
    const user = store.login({ email: 'user@giakiet.com', password: 'user123' });
    expect(store.isAdminToken(`Bearer ${admin.accessToken}`)).toBeTrue();
    expect(store.isAdminToken(`Bearer ${user.accessToken}`)).toBeFalse();
    expect(store.isAdminToken('Bearer invalid')).toBeFalse();
  });

  it('migrates extra stored admins into regular users', () => {
    localStorage.setItem('mock_accounts', JSON.stringify([
      { user: { id: 99, fullName: 'Extra admin', email: 'extra@example.com', role: 'admin' }, password: 'secret123' }
    ]));
    const store = TestBed.inject(MockAuthStore);
    const extra = store.login({ email: 'extra@example.com', password: 'secret123' });
    expect(extra.user.role).toBe('user');
    expect(store.isAdminToken(`Bearer ${extra.accessToken}`)).toBeFalse();
    expect(store.login(MOCK_ADMIN_CREDENTIALS).user).toEqual(MOCK_ADMIN_LOGIN_RESPONSE.user);
  });

  it('never grants admin to a newly registered account', () => {
    const store = TestBed.inject(MockAuthStore);
    const result = store.register({ fullName: 'New User', email: 'new@example.com', phone: '0901234567', password: 'secret123' });
    expect(result.user.role).toBe('user');
    expect(store.isAdminToken(`Bearer ${result.accessToken}`)).toBeFalse();
    expect(() => store.register({ fullName: 'Duplicate', email: MOCK_ADMIN_CREDENTIALS.email, phone: '', password: 'secret123' })).toThrow();
  });
});
