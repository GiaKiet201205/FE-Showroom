import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ReportOverview, ReportTimeRange } from '../../models/report.model';
import { MOCK_REPORT_OVERVIEW } from './report.mock';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);
  private endpoint = '/admin/reports/overview';

  getOverview(range: ReportTimeRange): Observable<ReportOverview> {
    return this.http.get<ReportOverview>(this.endpoint, { params: { range } }).pipe(
      catchError(() => of(MOCK_REPORT_OVERVIEW))
    );
  }
}