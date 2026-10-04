import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { SellerListResult } from '../../models/seller.model';
import { MOCK_SELLERS, MOCK_SELLERS_TOTAL, MOCK_SELLER_STATS } from './seller.mock';

export interface SellerQuery {
  search?: string;
  status?: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class SellerService {
  private http = inject(HttpClient);
  private endpoint = '/admin/sellers';

  getList(query: SellerQuery): Observable<SellerListResult> {
    const params = {
      search: query.search ?? '',
      status: query.status ?? '',
      page: String(query.page),
      pageSize: String(query.pageSize)
    };

    return this.http.get<SellerListResult>(this.endpoint, { params }).pipe(
      catchError(() =>
        of({
          items: MOCK_SELLERS,
          total: MOCK_SELLERS_TOTAL,
          page: query.page,
          pageSize: query.pageSize,
          stats: MOCK_SELLER_STATS
        })
      )
    );
  }
}