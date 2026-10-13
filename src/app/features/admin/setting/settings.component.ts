import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { SettingsService } from '../../../core/services/setting/settings.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationPrefs } from '../../../core/models/settings.model';

interface SettingsSection {
  id: string;
  label: string;
}

interface NotificationItem {
  key: keyof NotificationPrefs;
  title: string;
  description: string;
}

const MAX_AVATAR_BYTES = 800 * 1024;

// Validator cấp nhóm: mật khẩu mới và xác nhận phải trùng nhau
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword
    ? { mismatch: true }
    : null;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class AdminSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);
  private notification = inject(NotificationService);

  loading = signal(true);
  activeSection = signal('profile');
  avatarPreview = signal<string | null>(null);

  sections: SettingsSection[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'system', label: 'System' }
  ];

  notificationItems: NotificationItem[] = [
    { key: 'email', title: 'Email Notifications', description: 'Receive real-time email audits of vehicle transactions' },
    { key: 'push', title: 'Push Notifications', description: 'Alert updates inside the active portal viewport' },
    { key: 'sms', title: 'SMS Alerts', description: 'Secure SMS dispatches for emergency system reboots' },
    { key: 'weeklyReports', title: 'Weekly Reports', description: 'Weekly catalog performance summary PDF report delivery' },
    { key: 'newUserRegistration', title: 'New User Registration', description: 'Get notified as soon as a new seller joins the verified pool' },
    { key: 'testDriveBookings', title: 'Test Drive Bookings', description: 'Live warnings on newly reserved customer drive tests' },
    { key: 'orderStatusUpdates', title: 'Order Status Updates', description: 'Automatic flags on refunded, pending or processing transactions' }
  ];

  // Reactive Forms: mỗi khối có form riêng, validate riêng
  profileForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    role: this.fb.nonNullable.control({ value: '', disabled: true }),
    bio: ['']
  });

  securityForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordsMatch }
  );

  twoFactor = this.fb.nonNullable.control(false);

  notificationsForm = this.fb.nonNullable.group({
    email: false,
    push: false,
    sms: false,
    weeklyReports: false,
    newUserRegistration: false,
    testDriveBookings: false,
    orderStatusUpdates: false
  });

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        this.profileForm.patchValue(settings.profile);
        this.notificationsForm.patchValue(settings.notifications);
        this.twoFactor.setValue(settings.twoFactorEnabled);
        this.avatarPreview.set(settings.profile.avatarUrl ?? null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  scrollTo(sectionId: string): void {
    this.activeSection.set(sectionId);
    document
      .getElementById(`settings-${sectionId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== Profile =====
  onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!/^image\/(jpeg|png|gif)$/.test(file.type)) {
      this.notification.showError('Chỉ chấp nhận ảnh JPG, GIF hoặc PNG.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      this.notification.showError('Ảnh vượt quá dung lượng tối đa 800KB.');
      return;
    }

    this.avatarPreview.set(URL.createObjectURL(file));
  }

  removeAvatar(): void {
    this.avatarPreview.set(null);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const { fullName, email, phone, bio } = this.profileForm.getRawValue();
    this.settingsService.saveProfile({ fullName, email, phone, bio }).subscribe(() => {
      this.notification.showSuccess('Đã lưu thông tin hồ sơ.');
    });
  }

  // ===== Security =====
  updateCredentials(): void {
    if (this.securityForm.invalid) {
      this.securityForm.markAllAsTouched();
      return;
    }
    const { currentPassword, newPassword } = this.securityForm.getRawValue();
    this.settingsService.changePassword({ currentPassword, newPassword }).subscribe(() => {
      this.securityForm.reset();
      this.notification.showSuccess('Đã cập nhật mật khẩu.');
    });
  }

  onTwoFactorChange(): void {
    this.settingsService.setTwoFactor(this.twoFactor.value).subscribe(() => {
      this.notification.showSuccess(
        this.twoFactor.value ? 'Đã bật xác thực 2 lớp.' : 'Đã tắt xác thực 2 lớp.'
      );
    });
  }

  // ===== Notifications (tự lưu mỗi khi bật/tắt, không có nút Save) =====
  onNotificationChange(): void {
    this.settingsService.saveNotifications(this.notificationsForm.getRawValue()).subscribe(() => {
      this.notification.showSuccess('Đã lưu cài đặt thông báo.');
    });
  }

  // ===== Helpers cho template =====
  invalid(form: AbstractControl, name: string): boolean {
    const c = form.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }
}