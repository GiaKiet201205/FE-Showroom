import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { BrandListResult } from '../../models/brand.model';
import { MOCK_BRANDS, MOCK_BRANDS_TOTAL } from './brand.mock';

export interface BrandQuery {
  search?: string;
  region?: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class BrandService {
  private http = inject(HttpClient);
  private endpoint = '/admin/brands';

  getList(query: BrandQuery): Observable<BrandListResult> {
    const params = {
      search: query.search ?? '',
      region: query.region ?? '',
      page: String(query.page),
      pageSize: String(query.pageSize)
    };

    return this.http.get<BrandListResult>(this.endpoint, { params }).pipe(
      catchError(() =>
        of({
          items: MOCK_BRANDS,
          total: MOCK_BRANDS_TOTAL,
          page: query.page,
          pageSize: query.pageSize
        })
      )
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}