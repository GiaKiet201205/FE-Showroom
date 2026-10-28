import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { MockAuthStore } from './mock-auth.store';
import { UserService } from '../services/user/user.service';

describe('Admin-managed User passwords and website login', () => {
  let users: UserService;
  let auth: MockAuthStore;
  beforeEach(() => {
    localStorage.clear();
    users = TestBed.inject(UserService);
    auth = TestBed.inject(MockAuthStore);
  });
  afterEach(() => localStorage.clear());
  const input = { fullName: 'Website Customer', email: 'website@example.com', phone: '0901234567',
    registeredAt: '', role: 'user' as const, status: 'active' as const, password: 'initial123' };

  it('allows a User created in admin to sign in, without exposing passwords in profiles', async () => {
    const user = await firstValueFrom(users.create(input));
    expect(auth.login({ email: input.email, password: input.password }).user.id).toBe(user.id);
    expect(auth.login({ email: input.email, password: input.password }).user.role).toBe('user');
    expect(Object.keys(user)).not.toContain('password');
    expect(Object.keys(users.getSnapshot().find(profile => profile.id === user.id)!)).not.toContain('password');
    expect(() => auth.login({ email: input.email, password: 'incorrect' })).toThrow();
  });

  it('preserves a blank password on edit, accepts resets and invalidates the old session', async () => {
    const user = await firstValueFrom(users.create(input));
    const session = auth.login({ email: input.email, password: input.password });
    await firstValueFrom(users.update(user.id, { fullName: 'Updated Name', password: '' }));
    expect(auth.login({ email: input.email, password: input.password }).user.fullName).toBe('Updated Name');
    await firstValueFrom(users.update(user.id, { password: 'changed123' }));
    expect(auth.sessionUser(session.accessToken)).toBeNull();
    expect(() => auth.login({ email: input.email, password: input.password })).toThrow();
    expect(auth.login({ email: input.email, password: 'changed123' }).user.id).toBe(user.id);
    const restored = new UserService();
    expect(restored.authenticate(input.email, 'changed123')?.id).toBe(user.id);
  });

  it('uses updated email and denies blocked or deleted accounts', async () => {
    const user = await firstValueFrom(users.create(input));
    await firstValueFrom(users.update(user.id, { email: 'renamed@example.com' }));
    expect(() => auth.login({ email: input.email, password: input.password })).toThrow();
    expect(auth.login({ email: 'renamed@example.com', password: input.password }).user.id).toBe(user.id);
    await firstValueFrom(users.update(user.id, { status: 'blocked' }));
    expect(() => auth.login({ email: 'renamed@example.com', password: input.password })).toThrow();
    await firstValueFrom(users.delete(user.id));
    expect(() => auth.login({ email: 'renamed@example.com', password: input.password })).toThrow();
  });
});
