import { BrandService } from '../services/brand/brand.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vehicle, VehicleListResult } from '../models/vehicle.model';
import { MOCK_VEHICLES } from '../services/vehicle/vehicle.mock';

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
export class MockVehicleStore {
  private brands = inject(BrandService);
  private bookingVehicles = new Set<number>();
  getSnapshot(): Vehicle[] { return this.vehicles.map(vehicle => ({ ...vehicle })); }
  retainForBooking(id: number): void { this.bookingVehicles.add(id); }
  private vehicles: Vehicle[] = MOCK_VEHICLES.map(v => ({ ...v }));

  getBodyTypes(): Observable<string[]> {
    const types = this.vehicles
      .filter(vehicle => vehicle.status === 'available')
      .map(vehicle => vehicle.bodyType)
      .filter((type): type is string => !!type?.trim());

    return of([...new Set(types)].sort());
  }

  getList(query: VehicleQuery): Observable<VehicleListResult> {
    let result = [
      ...this.vehicles
    ];


    // =====================================================
    // SEARCH
    // =====================================================

    const search =
      query.search
        ?.trim()
        .toLowerCase();


    if (search) {

      result = result.filter(vehicle => {

        const values = [

          vehicle.brand,

          vehicle.model,

          vehicle.color,

          vehicle.bodyType ?? '',

          vehicle.fuelType ?? '',

          vehicle.transmission ?? '',

          String(vehicle.year)

        ];


        return values.join(' ').toLowerCase().includes(search);

      });

    }


    // =====================================================
    // BRAND
    // =====================================================

    if (
      query.brand &&
      query.brand !== 'all'
    ) {

      result =
        result.filter(
          vehicle =>
            vehicle.brand === query.brand
        );

    }


    // =====================================================
    // STATUS
    // =====================================================

    if (
      query.status &&
      query.status !== 'all'
    ) {

      result =
        result.filter(
          vehicle =>
            vehicle.status === query.status
        );

    }


    // =====================================================
    // CONDITION
    // =====================================================

    if (
      query.condition &&
      query.condition !== 'all'
    ) {

      result =
        result.filter(
          vehicle =>
            vehicle.condition ===
            query.condition
        );

    }


    // =====================================================
    // YEAR - ADMIN
    // =====================================================

    if (
      query.year &&
      query.year !== 'all'
    ) {

      result =
        result.filter(
          vehicle =>
            String(vehicle.year) ===
            query.year
        );

    }


    // =====================================================
    // YEAR RANGE - USER
    // =====================================================

    if (
      query.minYear !== undefined
    ) {

      result =
        result.filter(
          vehicle =>
            vehicle.year >=
            query.minYear!
        );

    }


    if (
      query.maxYear !== undefined
    ) {

      result =
        result.filter(
          vehicle =>
            vehicle.year <=
            query.maxYear!
        );

    }


    // =====================================================
    // PRICE
    // =====================================================

    if (
      query.minPrice !== undefined
    ) {

      result =
        result.filter(
          vehicle =>
            vehicle.price >=
            query.minPrice!
        );

    }


    if (
      query.maxPrice !== undefined
    ) {

      result =
        result.filter(
          vehicle =>
            vehicle.price <=
            query.maxPrice!
        );

    }


    // =====================================================
    // BODY TYPE
    // =====================================================

    if (
      query.bodyTypes &&
      query.bodyTypes.length > 0
    ) {

      result =
        result.filter(
          vehicle =>
            vehicle.bodyType
              ? query.bodyTypes!
                  .includes(
                    vehicle.bodyType
                  )
              : false
        );

    }


    // =====================================================
    // SORT
    // =====================================================

    switch (
      query.sort
    ) {

      case 'price-asc':

        result.sort(
          (a, b) =>
            a.price - b.price
        );

        break;


      case 'price-desc':

        result.sort(
          (a, b) =>
            b.price - a.price
        );

        break;


      case 'year-desc':

        result.sort(
          (a, b) =>
            b.year - a.year
        );

        break;


      default:

        result.sort(
          (a, b) =>
            b.id - a.id
        );

    }


    // =====================================================
    // PAGINATION
    // =====================================================

    const total =
      result.length;


    const start =
      (query.page - 1)
      * query.pageSize;


    const items =
      result.slice(
        start,
        start +
        query.pageSize
      );


    return of({

      items,

      total,

      page:
        query.page,

      pageSize:
        query.pageSize

    });

  }

  create(vehicle: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    this.validateInventory(vehicle.stockQuantity);
    this.validateBrand(vehicle.brand);
    const newVehicle: Vehicle = {
      ...vehicle,
      condition: 'new',
      id: Math.max(0, ...this.vehicles.map(v => v.id)) + 1
    };

    this.vehicles = [...this.vehicles, newVehicle];
    // Sử dụng of() để trả về một Observable
    this.brands.syncVehicleCounts(this.vehicles);
    return of(newVehicle);
  }

  update(id: number, changes: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    this.validateInventory(changes.stockQuantity);
    this.validateBrand(changes.brand);
    const index = this.vehicles.findIndex(v => v.id === id);

    if (index === -1) {
      throw new HttpErrorResponse({ status: 404, error: { message: 'Không tìm thấy xe.' } });
    }

    const updated: Vehicle = { ...this.vehicles[index], ...changes, condition: 'new', id };
    this.vehicles = this.vehicles.map(v => v.id === id ? updated : v);

    // Sử dụng of() để trả về một Observable
    this.brands.syncVehicleCounts(this.vehicles);
    return of(updated);
  }

  delete(id: number): Observable<void> {
    if (this.bookingVehicles.has(id)) throw new HttpErrorResponse({ status: 409, error: { message: 'Xe đã có lịch lái thử, không thể xoá.' } });
    this.vehicles = this.vehicles.filter(v => v.id !== id);
    // Sử dụng of() để trả về một Observable
    this.brands.syncVehicleCounts(this.vehicles);
    return of(undefined);
  }

  getById(
    id: number
  ): Observable<Vehicle | undefined> {

    const vehicle =
      this.vehicles.find(
        vehicle =>
          vehicle.id === id
      );

    return of(vehicle);

  }


  getFeatured(
    limit = 4
  ): Observable<Vehicle[]> {

    const vehicles =
      this.vehicles
        .filter(
          vehicle =>
            vehicle.featured
        )
        .slice(
          0,
          limit
        );

    return of(vehicles);

  }


  getByIds(
    ids: number[]
  ): Observable<Vehicle[]> {

    const vehicles =
      this.vehicles.filter(
        vehicle =>
          ids.includes(vehicle.id)
      );

    return of(vehicles);

  }
  private validateInventory(quantity: number): void {
    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      throw new HttpErrorResponse({ status: 400, error: { message: 'Số lượng tồn kho phải là số nguyên không âm.' } });
    }
  }
  private validateBrand(name: string): void {
    if (!this.brands.getSnapshot().some(brand => brand.name === name)) {
      throw new HttpErrorResponse({ status: 400, error: { message: 'Vui lòng chọn thương hiệu có trong showroom.' } });
    }
  }
}
