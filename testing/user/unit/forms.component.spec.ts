import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProfileComponent } from '../../../src/app/features/home/profile/profile.component';
import { ContactComponent } from '../../../src/app/features/home/contact/contact.component';
import { ForgotPasswordComponent } from '../../../src/app/features/auth/pages/forgot-password/forgot-password.component';
import { NotificationService } from '../../../src/app/core/services/notification.service';
import { AuthService } from '../../../src/app/core/services/auth.service';

describe('User — profile/contact/forgot password (mock)', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [ProfileComponent, ContactComponent, ForgotPasswordComponent], providers: [
      provideRouter([]), { provide: NotificationService, useValue: { showSuccess: jasmine.createSpy('success') } },
      { provide: AuthService, useValue: { forgotPassword: jasmine.createSpy('forgot').and.returnValue(of({ message: 'Mock reset request' })) } },
    ] });
  });
  afterEach(() => localStorage.clear());

  it('profile sai dữ liệu không lưu lịch sử', () => {
    const page = TestBed.createComponent(ProfileComponent).componentInstance;
    page.profileForm.patchValue({ fullName: '', email: 'invalid', phone: 'abc', location: '' });
    page.saveChanges();
    expect(page.savedProfiles.length).toBe(1); expect(page.showSuccess).toBeFalse();
    expect(page.invalid('email')).toBeTrue();
  });
  it('profile hợp lệ lưu bản ghi cục bộ và thông báo tắt sau 3 giây', fakeAsync(() => {
    const page = TestBed.createComponent(ProfileComponent).componentInstance;
    page.profileForm.patchValue({ fullName: 'Updated Name' }); page.saveChanges();
    expect(page.user.name).toBe('Updated Name'); expect(page.savedProfiles.length).toBe(2);
    expect(page.showSuccess).toBeTrue(); tick(3000); expect(page.showSuccess).toBeFalse();
  }));
  it('contact validation và submit hợp lệ lưu vào messages rồi reset form', () => {
    const fixture = TestBed.createComponent(ContactComponent); fixture.detectChanges();
    const page = fixture.componentInstance;
    page.sendMessage(); expect(page.messages).toEqual([]);
    const input = { fullName: 'Website Customer', email: 'customer@example.com', phone: '0901234567', subject: 'general', message: 'Please tell me more about this vehicle.' };
    page.contactForm.setValue(input); page.sendMessage();
    expect(page.messages).toEqual([input]); expect(page.submitted).toBeTrue();
    expect(page.contactForm.controls.message.value).toBe('');
    const wasOpen = page.faqs[0].open; page.toggleFaq(0); expect(page.faqs[0].open).toBe(!wasOpen);
  });
  it('forgot password validation, thành công và lỗi request', () => {
    const page = TestBed.createComponent(ForgotPasswordComponent).componentInstance;
    const auth = TestBed.inject(AuthService);
    page.submit(); expect(auth.forgotPassword).not.toHaveBeenCalled();
    page.form.controls.email.setValue('customer@example.com'); page.submit();
    expect(page.message).toBe('Mock reset request'); expect(page.submitting).toBeFalse();
    (auth.forgotPassword as jasmine.Spy).and.returnValue(throwError(() => new Error('Network')));
    page.submit(); expect(page.message).toContain('Không thể xử lý yêu cầu');
  });
});
