import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ReportOverview, ReportTimeRange } from '../../models/report.model';
import { MOCK_REPORT_OVERVIEW } from './report.mock';

@Injectable({ providedIn: 'root' })
export class ReportService {
  getOverview(_range: ReportTimeRange): Observable<ReportOverview> {
    return of(MOCK_REPORT_OVERVIEW);
  }
}
