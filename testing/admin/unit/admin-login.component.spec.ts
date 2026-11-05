import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { LoginComponent } from '../../../src/app/features/auth/login/login.component';
import { AuthService } from '../../../src/app/core/services/auth.service';
import { LoginResponse } from '../../../src/app/core/models/auth.model';
import { MOCK_ADMIN_CREDENTIALS, MOCK_ADMIN_LOGIN_RESPONSE } from '../../../src/app/core/services/auth.mock';

describe('01. Đăng nhập admin — TestBed', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let redirectTo: string | undefined;

  beforeEach(async () => {
    redirectTo = '/admin/vehicles';
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['login', 'isAdmin', 'logout']);
    auth.login.and.returnValue(of(MOCK_ADMIN_LOGIN_RESPONSE));
    auth.isAdmin.and.returnValue(true);
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: {
          snapshot: { get queryParamMap() { return convertToParamMap({ redirectTo }); } },
        } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('chặn form trống, email sai định dạng và mật khẩu dưới 6 ký tự', () => {
    for (const input of [
      { email: '', password: '' },
      { email: 'invalid', password: '123' },
    ]) {
      component.form.setValue(input);
      component.submit();
      fixture.detectChanges();
      expect(component.emailInvalid).toBeTrue();
      expect(component.passwordInvalid).toBeTrue();
      expect(fixture.nativeElement.querySelectorAll('.field-error').length).toBe(2);
    }
    expect(auth.login).not.toHaveBeenCalled();
  });

  it('đăng nhập hợp lệ và chuyển tới Vehicles theo redirectTo', () => {
    component.form.setValue(MOCK_ADMIN_CREDENTIALS);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
    expect(auth.login).toHaveBeenCalledOnceWith(MOCK_ADMIN_CREDENTIALS);
    expect(router.navigateByUrl).toHaveBeenCalledOnceWith('/admin/vehicles');
    expect(component.submitting).toBeFalse();
  });

  it('không chuyển tới redirect bên ngoài khu vực admin', () => {
    redirectTo = 'https://example.com';
    component.form.setValue(MOCK_ADMIN_CREDENTIALS);
    component.submit();
    expect(router.navigateByUrl).toHaveBeenCalledOnceWith('/admin/dashboard');
  });

  it('đăng xuất tài khoản không có quyền admin và hiển thị lỗi', () => {
    auth.isAdmin.and.returnValue(false);
    component.form.setValue(MOCK_ADMIN_CREDENTIALS);
    component.submit();
    fixture.detectChanges();
    expect(auth.logout).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.form-error').textContent)
      .toContain('Tài khoản này không có quyền quản trị.');
  });

  it('hiển thị lỗi mật khẩu và cho phép thử lại thành công', () => {
    auth.login.and.returnValue(throwError(() => new HttpErrorResponse({
      status: 401, error: { message: 'Email hoặc mật khẩu không đúng.' },
    })));
    component.form.setValue(MOCK_ADMIN_CREDENTIALS);
    component.submit();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.form-error').textContent)
      .toContain('Email hoặc mật khẩu không đúng.');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(component.submitting).toBeFalse();
    auth.login.and.returnValue(of(MOCK_ADMIN_LOGIN_RESPONSE));
    component.submit();
    expect(component.errorMessage).toBe('');
    expect(router.navigateByUrl).toHaveBeenCalledOnceWith('/admin/vehicles');
  });

  it('dùng thông báo mặc định khi request lỗi mà không có message', () => {
    auth.login.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    component.form.setValue(MOCK_ADMIN_CREDENTIALS);
    component.submit();
    expect(component.errorMessage).toBe('Không thể đăng nhập.');
    expect(component.submitting).toBeFalse();
  });

  it('vô hiệu nút đăng nhập và chặn gửi trùng khi request đang chạy', () => {
    const pending = new Subject<LoginResponse>();
    auth.login.and.returnValue(pending);
    component.form.setValue(MOCK_ADMIN_CREDENTIALS);
    component.submit();
    component.submit();
    fixture.detectChanges();
    expect(auth.login).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue();
    pending.next(MOCK_ADMIN_LOGIN_RESPONSE);
    pending.complete();
    expect(component.submitting).toBeFalse();
  });
});
