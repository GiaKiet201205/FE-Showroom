import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle, VehicleListResult } from '../../models/vehicle.model';
export interface VehicleQuery {
  // SEARCH
  search?: string;

  // FILTER
  brand?: string;
  status?: string;
  year?: string;

  condition?: string;

  minPrice?: number;
  maxPrice?: number;

  minYear?: number;
  maxYear?: number;

  bodyTypes?: string[];

  // SORT
  sort?: string;

  // PAGINATION
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);

  getList(query: VehicleQuery): Observable<VehicleListResult> {
    let result = [...this.vehicles];

    // =====================================================
    // SEARCH
    // =====================================================

    const search = query.search?.trim().toLowerCase();

    if (search) {
      result = result.filter((vehicle) => {
        const values = [
          vehicle.brand,

          vehicle.model,

          vehicle.color,

          vehicle.bodyType ?? '',

          vehicle.fuelType ?? '',

          vehicle.transmission ?? '',

          String(vehicle.year),
        ];

        return values.some((value) => value.toLowerCase().includes(search));
      });
    }

    // =====================================================
    // BRAND
    // =====================================================

    if (query.brand && query.brand !== 'all') {
      result = result.filter((vehicle) => vehicle.brand === query.brand);
    }

    // =====================================================
    // STATUS
    // =====================================================

    if (query.status && query.status !== 'all') {
      result = result.filter((vehicle) => vehicle.status === query.status);
    }

    // =====================================================
    // CONDITION
    // =====================================================

    if (query.condition && query.condition !== 'all') {
      result = result.filter(
        (vehicle) => vehicle.condition === query.condition,
      );
    }

    // =====================================================
    // YEAR - ADMIN
    // =====================================================

    if (query.year && query.year !== 'all') {
      result = result.filter((vehicle) => String(vehicle.year) === query.year);
    }

    // =====================================================
    // YEAR RANGE - USER
    // =====================================================

    if (query.minYear !== undefined) {
      result = result.filter((vehicle) => vehicle.year >= query.minYear!);
    }

    if (query.maxYear !== undefined) {
      result = result.filter((vehicle) => vehicle.year <= query.maxYear!);
    }

    // =====================================================
    // PRICE
    // =====================================================

    if (query.minPrice !== undefined) {
      result = result.filter((vehicle) => vehicle.price >= query.minPrice!);
    }

    if (query.maxPrice !== undefined) {
      result = result.filter((vehicle) => vehicle.price <= query.maxPrice!);
    }

    // =====================================================
    // BODY TYPE
    // =====================================================

    if (query.bodyTypes && query.bodyTypes.length > 0) {
      result = result.filter((vehicle) =>
        vehicle.bodyType ? query.bodyTypes!.includes(vehicle.bodyType) : false,
      );
    }

    // =====================================================
    // SORT
    // =====================================================

    switch (query.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);

        break;

      case 'price-desc':
        result.sort((a, b) => b.price - a.price);

        break;

      case 'year-desc':
        result.sort((a, b) => b.year - a.year);

        break;

      default:
        result.sort((a, b) => b.id - a.id);
    }

    // =====================================================
    // PAGINATION
    // =====================================================

    const total = result.length;

    const start = (query.page - 1) * query.pageSize;

    const items = result.slice(start, start + query.pageSize);

    return of({
      items,

      total,

      page: query.page,

      pageSize: query.pageSize,
    });
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined)
        params = params.set(
          key,
          Array.isArray(value) ? value.join(',') : String(value),
        );
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
    return this.http.get<Vehicle[]>('/vehicles/featured', {
      params: { limit },
    });
  }
  getByIds(ids: number[]): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('/vehicles/selection', {
      params: { ids: ids.join(',') },
    });
  }
}
