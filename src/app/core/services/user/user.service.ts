import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { UserListResult } from '../../models/user.model';
import { MOCK_USERS, MOCK_USERS_TOTAL, MOCK_USER_STATS } from './user.mock';

export interface UserQuery {
  search?: string;
  role?: string;
  status?: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private endpoint = '/admin/users';

  getList(query: UserQuery): Observable<UserListResult> {
    const params = {
      search: query.search ?? '',
      role: query.role ?? '',
      status: query.status ?? '',
      page: String(query.page),
      pageSize: String(query.pageSize)
    };

    return this.http.get<UserListResult>(this.endpoint, { params }).pipe(
      catchError(() =>
        of({
          items: MOCK_USERS,
          total: MOCK_USERS_TOTAL,
          page: query.page,
          pageSize: query.pageSize,
          stats: MOCK_USER_STATS
        })
      )
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  toggleBlock(id: number): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/${id}/toggle-block`, {});
  }
}