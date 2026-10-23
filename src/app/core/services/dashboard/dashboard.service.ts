import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { DashboardOverview } from '../../models/dashboard.model';
import { MOCK_DASHBOARD_OVERVIEW } from './dashboard.mock';

/**
 * DashboardService: nơi DUY NHẤT chứa logic lấy dữ liệu cho trang Dashboard.
 * Component chỉ gọi getOverview() và bind ra UI, không tự biết API endpoint
 * hay cách xử lý khi lỗi.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  getOverview(): Observable<DashboardOverview> {
    return of(MOCK_DASHBOARD_OVERVIEW);
  }
}
