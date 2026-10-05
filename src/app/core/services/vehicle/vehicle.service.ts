import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Vehicle, VehicleListResult } from '../../models/vehicle.model';
import { MOCK_VEHICLES, MOCK_VEHICLES_TOTAL } from './vehicle.mock';

export interface VehicleQuery {
  search?: string;
  brand?: string;
  status?: string;
  year?: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);
  private endpoint = '/admin/vehicles';

  getList(query: VehicleQuery): Observable<VehicleListResult> {
    const params = {
      search: query.search ?? '',
      brand: query.brand ?? '',
      status: query.status ?? '',
      year: query.year ?? '',
      page: String(query.page),
      pageSize: String(query.pageSize)
    };

    return this.http.get<VehicleListResult>(this.endpoint, { params }).pipe(
      catchError(() =>
        of({
          items: MOCK_VEHICLES,
          total: MOCK_VEHICLES_TOTAL,
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