import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { TestDriveListResult } from '../../models/test-drive.model';
import { MOCK_TEST_DRIVES, MOCK_TEST_DRIVES_TOTAL, MOCK_TEST_DRIVE_STATS } from './test-drive.mock';

export interface TestDriveQuery {
  search?: string;
  date?: string;
  status?: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class TestDriveService {
  private http = inject(HttpClient);
  private endpoint = '/admin/test-drives';

  getList(query: TestDriveQuery): Observable<TestDriveListResult> {
    const params = {
      search: query.search ?? '',
      date: query.date ?? '',
      status: query.status ?? '',
      page: String(query.page),
      pageSize: String(query.pageSize)
    };

    return this.http.get<TestDriveListResult>(this.endpoint, { params }).pipe(
      catchError(() =>
        of({
          items: MOCK_TEST_DRIVES,
          total: MOCK_TEST_DRIVES_TOTAL,
          page: query.page,
          pageSize: query.pageSize,
          stats: MOCK_TEST_DRIVE_STATS
        })
      )
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}