import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from '../../../src/app/core/services/auth.service';
import { MockAuthStore } from '../../../src/app/core/mock/mock-auth.store';
import { UserService } from '../../../src/app/core/services/user/user.service';
import { apiPrefixInterceptor } from '../../../src/app/core/interceptors/api-prefix.interceptor';
import { mockApiInterceptor } from '../../../src/app/core/mock/mock-api.interceptor';

describe('User — AuthService tích hợp mock API', () => {
  let auth: AuthService;
  const input = { fullName: 'Website Customer', email: 'customer@example.com', password: 'customer123', phone: '0901234567' };
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors([apiPrefixInterceptor, mockApiInterceptor]))] });
    auth = TestBed.inject(AuthService);
  });
  afterEach(() => localStorage.clear());

  it('register tạo User, đăng nhập tự động và khôi phục phiên sau reload service', fakeAsync(() => {
    auth.register(input).subscribe({ error: fail }); tick(450);
    expect(auth.isLoggedIn()).toBeTrue();
    expect(auth.isAdmin()).toBeFalse();
    expect(auth.canAccessAdmin()).toBeFalse();
    expect(TestBed.inject(UserService).authenticate(input.email, input.password)?.role).toBe('user');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors([apiPrefixInterceptor, mockApiInterceptor]))] });
    auth = TestBed.inject(AuthService);
    expect(auth.currentUser()?.email).toBe(input.email);
  }));

  it('logout xóa session và token, token cũ không còn dùng được', fakeAsync(() => {
    auth.register(input).subscribe({ error: fail }); tick(450);
    const token = auth.getToken();
    auth.logout();
    expect(auth.isLoggedIn()).toBeFalse();
    expect(auth.currentUser()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(TestBed.inject(MockAuthStore).sessionUser(token)).toBeNull();
  }));

  it('email trùng không tạo tài khoản thứ hai, mật khẩu sai không tạo phiên', fakeAsync(() => {
    auth.register(input).subscribe({ error: fail }); tick(450);
    auth.logout();
    const errors = jasmine.createSpy('error');
    auth.register(input).subscribe({ next: () => fail('Duplicate accepted'), error: errors }); tick(450);
    auth.login({ email: input.email, password: 'incorrect' }).subscribe({ next: () => fail('Invalid login'), error: errors }); tick(450);
    expect(errors).toHaveBeenCalledTimes(2);
    expect(auth.isLoggedIn()).toBeFalse();
  }));

  it('tài khoản pending/blocked không đăng nhập được', fakeAsync(() => {
    auth.register(input).subscribe({ error: fail }); tick(450);
    const id = auth.currentUser()!.id;
    auth.logout();
    for (const status of ['pending', 'blocked'] as const) {
      TestBed.inject(UserService).update(id, { status }).subscribe({ error: fail });
      const error = jasmine.createSpy('error');
      auth.login(input).subscribe({ next: () => fail('Inactive account accepted'), error }); tick(450);
      expect(error).toHaveBeenCalled();
      expect(auth.isLoggedIn()).toBeFalse();
    }
  }));
});
