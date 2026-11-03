import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { SignUpComponent } from '../../../src/app/features/auth/pages/sign-up/sign-up.component';
import { SignInComponent } from '../../../src/app/features/auth/pages/sign-in/sign-in.component';
import { AuthService } from '../../../src/app/core/services/auth.service';
import { LoginResponse } from '../../../src/app/core/models/auth.model';

describe('User — đăng ký/đăng nhập qua component TestBed', () => {
  let auth: jasmine.SpyObj<AuthService>;
  const input = { fullName: 'Website Customer', email: 'website@example.com', phone: '0901234567',
    password: 'customer123', confirmPassword: 'customer123', acceptTerms: true };
  const session: LoginResponse = { accessToken: 'user-token', user: { id: 102, fullName: input.fullName, email: input.email, role: 'user' } };
  beforeEach(() => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['emailAvailable', 'register', 'login', 'isAdmin']);
    auth.emailAvailable.and.returnValue(of({ available: true }));
    auth.register.and.returnValue(of(session));
    auth.login.and.returnValue(of(session));
    auth.isAdmin.and.returnValue(false);
    TestBed.configureTestingModule({ imports: [SignUpComponent, SignInComponent], providers: [
      provideRouter([]), { provide: AuthService, useValue: auth },
    ] });
    spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
  });

  it('đăng ký: validation trường trống/email/phone/password và điều khoản', fakeAsync(() => {
    const fixture = TestBed.createComponent(SignUpComponent);
    const page = fixture.componentInstance;
    page.submit();
    fixture.detectChanges();
    expect(page.isInvalid('fullName')).toBeTrue();
    expect(page.isInvalid('acceptTerms')).toBeTrue();
    page.form.setValue({ ...input, email: 'invalid', phone: 'abc', password: '123', confirmPassword: '123', acceptTerms: false });
    tick(300);
    page.submit();
    expect(page.form.invalid).toBeTrue();
    expect(auth.register).not.toHaveBeenCalled();
  }));

  it('đăng ký: mật khẩu xác nhận không khớp không gọi register', fakeAsync(() => {
    const page = TestBed.createComponent(SignUpComponent).componentInstance;
    page.form.setValue({ ...input, confirmPassword: 'different123' });
    tick(300);
    page.submit();
    expect(page.confirmPasswordInvalid).toBeTrue();
    expect(auth.register).not.toHaveBeenCalled();
  }));

  it('kiểm tra email debounce; pending không submit; email trùng bị từ chối', fakeAsync(() => {
    auth.emailAvailable.and.returnValue(of({ available: false }));
    const page = TestBed.createComponent(SignUpComponent).componentInstance;
    page.form.setValue(input);
    page.submit();
    tick(299);
    expect(auth.emailAvailable).not.toHaveBeenCalled();
    expect(auth.register).not.toHaveBeenCalled();
    tick(1);
    expect(auth.emailAvailable).toHaveBeenCalledOnceWith(input.email);
    expect(page.form.controls.email.hasError('emailTaken')).toBeTrue();
    page.submit();
    expect(auth.register).not.toHaveBeenCalled();
  }));

  it('email-check lỗi mạng đánh dấu emailCheckFailed thay vì cho đăng ký', fakeAsync(() => {
    auth.emailAvailable.and.returnValue(throwError(() => new Error('Network')));
    const page = TestBed.createComponent(SignUpComponent).componentInstance;
    page.form.setValue(input);
    tick(300);
    expect(page.form.controls.email.hasError('emailCheckFailed')).toBeTrue();
    page.submit();
    expect(auth.register).not.toHaveBeenCalled();
  }));

  it('đăng ký hợp lệ chuyển về home; request lỗi giữ form và cho thử lại', fakeAsync(() => {
    const page = TestBed.createComponent(SignUpComponent).componentInstance;
    page.form.setValue(input);
    tick(300);
    auth.register.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'Email đã tồn tại' } })));
    page.submit();
    expect(page.errorMessage).toBe('Email đã tồn tại');
    expect(page.submitting).toBeFalse();
    expect(page.form.getRawValue()).toEqual(input);
    auth.register.and.returnValue(of(session));
    page.submit();
    expect(TestBed.inject(Router).navigateByUrl).toHaveBeenCalledOnceWith('/home');
  }));

  it('đăng ký chặn submit trùng trong lúc request chạy', fakeAsync(() => {
    const pending = new Subject<LoginResponse>();
    auth.register.and.returnValue(pending);
    const page = TestBed.createComponent(SignUpComponent).componentInstance;
    page.form.setValue(input);
    tick(300);
    page.submit(); page.submit();
    expect(auth.register).toHaveBeenCalledTimes(1);
    pending.next(session); pending.complete();
    expect(page.submitting).toBeFalse();
  }));

  it('đăng nhập chặn form sai, hiện lỗi mật khẩu và thử lại thành công', () => {
    const fixture = TestBed.createComponent(SignInComponent);
    const page = fixture.componentInstance;
    page.submit();
    expect(auth.login).not.toHaveBeenCalled();
    page.form.patchValue({ email: input.email, password: input.password });
    auth.login.and.returnValue(throwError(() => new HttpErrorResponse({ status: 401, error: { message: 'Sai mật khẩu' } })));
    page.submit(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Sai mật khẩu');
    auth.login.and.returnValue(of(session));
    page.submit();
    expect(TestBed.inject(Router).navigateByUrl).toHaveBeenCalledOnceWith('/home');
  });
});
