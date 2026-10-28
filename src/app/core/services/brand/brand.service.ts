import { MOCK_VEHICLES } from '../vehicle/vehicle.mock';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Brand, BrandListResult } from '../../models/brand.model';
import { MOCK_BRANDS } from './brand.mock';

export interface BrandQuery {
  search?: string;
  region?: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class BrandService {
  private brands: Brand[] = MOCK_BRANDS.map(b => ({ ...b, listedVehicles: MOCK_VEHICLES.filter(vehicle => vehicle.brand === b.name).length }));

  getSnapshot(): Brand[] { return this.brands.map(brand => ({ ...brand })); }
  syncVehicleCounts(vehicles: { brand: string }[]): void {
    this.brands = this.brands.map(brand => ({ ...brand, listedVehicles: vehicles.filter(vehicle => vehicle.brand === brand.name).length }));
  }
  getList(query: BrandQuery): Observable<BrandListResult> {
    let result = [...this.brands];

    const search = query.search?.trim().toLowerCase();
    if (search) {
      result = result.filter(b =>
        b.name.toLowerCase().includes(search) ||
        b.origin.toLowerCase().includes(search)
      );
    }

    if (query.region && query.region !== 'all') {
      result = result.filter(b => b.origin === query.region);
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

  create(brand: Omit<Brand, 'id'>): Observable<Brand> {
    const newBrand: Brand = {
      ...brand,
      id: Math.max(0, ...this.brands.map(b => b.id)) + 1
    };
    this.brands = [...this.brands, newBrand];
    return of(newBrand);
  }

  update(id: number, changes: Partial<Brand>): Observable<Brand> {
    const index = this.brands.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy dữ liệu');
    }
    if (changes.name && changes.name !== this.brands[index].name && this.brands[index].listedVehicles > 0) return throwError(() => new Error('Thương hiệu đang có xe, không thể đổi tên.'));
    const updated = { ...this.brands[index], ...changes };
    this.brands = this.brands.map(b => b.id === id ? updated : b);
    return of(updated);
  }

  delete(id: number): Observable<void> {
    if (this.brands.find(brand => brand.id === id)?.listedVehicles) return throwError(() => new Error('Thương hiệu đang có xe, không thể xoá.'));
    this.brands = this.brands.filter(b => b.id !== id);
    return of(undefined);
  }
}