import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vehicle, VehicleListResult } from '../../models/vehicle.model';
import { MOCK_VEHICLES } from './vehicle.mock';

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
  private vehicles: Vehicle[] = MOCK_VEHICLES.map(v => ({ ...v }));

  getList(query: VehicleQuery): Observable<VehicleListResult> {
    let result = [...this.vehicles];

    const search = query.search?.trim().toLowerCase();

    if (search) {
      result = result.filter(v =>
        [v.brand, v.model, v.color, String(v.year)]
          .some(value => value.toLowerCase().includes(search))
      );
    }

    if (query.brand && query.brand !== 'all') {
      result = result.filter(v => v.brand === query.brand);
    }

    if (query.status && query.status !== 'all') {
      result = result.filter(v => v.status === query.status);
    }

    if (query.year && query.year !== 'all') {
      result = result.filter(v => String(v.year) === query.year);
    }

    const total = result.length;
    const start = (query.page - 1) * query.pageSize;
    const items = result.slice(start, start + query.pageSize);

    return of({
      items,
      total,
      page: query.page,
      pageSize: query.pageSize
    });
  }

  create(vehicle: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Math.max(0, ...this.vehicles.map(v => v.id)) + 1
    };

    this.vehicles = [...this.vehicles, newVehicle];
    // Sử dụng of() để trả về một Observable
    return of(newVehicle);
  }

  update(id: number, changes: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    const index = this.vehicles.findIndex(v => v.id === id);

    if (index === -1) {
      throw new Error(`Không tìm thấy dữ liệu`);
    }

    const updated: Vehicle = { ...changes, id };
    this.vehicles = this.vehicles.map(v => v.id === id ? updated : v);

    // Sử dụng of() để trả về một Observable
    return of(updated);
  }

  delete(id: number): Observable<void> {
    this.vehicles = this.vehicles.filter(v => v.id !== id);
    // Sử dụng of() để trả về một Observable
    return of(undefined);
  }
}