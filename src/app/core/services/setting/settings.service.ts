import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  AdminProfile,
  AdminSettings,
  ChangePasswordRequest,
  NotificationPrefs
} from '../../models/settings.model';
import { MOCK_ADMIN_SETTINGS } from './settings.mock';

/**
 * Dữ liệu Settings hiện dùng mock cục bộ; chưa gọi API khi backend chưa sẵn sàng.
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private settings: AdminSettings = {
    profile: { ...MOCK_ADMIN_SETTINGS.profile },
    notifications: { ...MOCK_ADMIN_SETTINGS.notifications },
    twoFactorEnabled: MOCK_ADMIN_SETTINGS.twoFactorEnabled
  };

  getSettings(): Observable<AdminSettings> {
    return of(this.copySettings());
  }

  saveProfile(profile: Partial<AdminProfile>): Observable<void> {
    this.settings.profile = { ...this.settings.profile, ...profile };
    return of(undefined);
  }

  changePassword(_payload: ChangePasswordRequest): Observable<void> {
    return of(undefined);
  }

  setTwoFactor(enabled: boolean): Observable<void> {
    this.settings.twoFactorEnabled = enabled;
    return of(undefined);
  }

  saveNotifications(prefs: NotificationPrefs): Observable<void> {
    this.settings.notifications = { ...prefs };
    return of(undefined);
  }

  private copySettings(): AdminSettings {
    return {
      profile: { ...this.settings.profile },
      notifications: { ...this.settings.notifications },
      twoFactorEnabled: this.settings.twoFactorEnabled
    };
  }
}
