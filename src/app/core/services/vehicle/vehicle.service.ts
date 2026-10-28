import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle, VehicleListResult } from '../../models/vehicle.model';
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

  getList(query: VehicleQuery): Observable<VehicleListResult> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) params = params.set(key, Array.isArray(value) ? value.join(',') : String(value));
    }
    return this.http.get<VehicleListResult>('/vehicles', { params });
  }
  create(vehicle: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    return this.http.post<Vehicle>('/vehicles', vehicle);
  }
  update(id: number, changes: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    return this.http.put<Vehicle>(`/vehicles/${id}`, changes);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/vehicles/${id}`);
  }
  getById(id: number): Observable<Vehicle | undefined> {
    return this.http.get<Vehicle | undefined>(`/vehicles/${id}`);
  }
  getFeatured(limit = 4): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('/vehicles/featured', { params: { limit } });
  }
  getByIds(ids: number[]): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('/vehicles/selection', { params: { ids: ids.join(',') } });
  }
}
