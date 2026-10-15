import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import {
  AdminProfile,
  AdminSettings,
  ChangePasswordRequest,
  NotificationPrefs
} from '../../models/settings.model';
import { MOCK_ADMIN_SETTINGS } from './settings.mock';

/**
 * Toàn bộ logic gọi API của trang Settings nằm ở đây.
 * Component chỉ gọi method và hiển thị kết quả.
 * Backend chưa có -> catchError trả dữ liệu mẫu để UI vẫn chạy được.
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private http = inject(HttpClient);
  private endpoint = '/admin/settings';

  getSettings(): Observable<AdminSettings> {
    return this.http
      .get<AdminSettings>(this.endpoint)
      .pipe(catchError(() => of(MOCK_ADMIN_SETTINGS)));
  }

  saveProfile(profile: Partial<AdminProfile>): Observable<unknown> {
    return this.http.put(`${this.endpoint}/profile`, profile).pipe(catchError(() => of(null)));
  }

  changePassword(payload: ChangePasswordRequest): Observable<unknown> {
    return this.http.put(`${this.endpoint}/password`, payload).pipe(catchError(() => of(null)));
  }

  setTwoFactor(enabled: boolean): Observable<unknown> {
    return this.http.put(`${this.endpoint}/two-factor`, { enabled }).pipe(catchError(() => of(null)));
  }

  saveNotifications(prefs: NotificationPrefs): Observable<unknown> {
    return this.http.put(`${this.endpoint}/notifications`, prefs).pipe(catchError(() => of(null)));
  }
}