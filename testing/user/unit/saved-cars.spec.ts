import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FavoriteService } from '../../../src/app/core/services/favorite.service';
import { CompareService } from '../../../src/app/core/services/compare.service';
import { CompareComponent } from '../../../src/app/features/home/compare/compare.component';
import { VehicleService } from '../../../src/app/core/services/vehicle/vehicle.service';
import { Vehicle } from '../../../src/app/core/models/vehicle.model';

describe('User — favorites/comparison', () => {
  const a: Vehicle = { id: 1, brand: 'BMW', model: 'Unit A', year: 2023, price: 50000,
    stockQuantity: 2, color: 'Black', status: 'available', horsepower: '600 hp' };
  const b: Vehicle = { ...a, id: 2, model: 'Unit B', year: 2024, price: 70000, horsepower: '1,000 hp' };
  let vehicles: jasmine.SpyObj<VehicleService>;
  beforeEach(() => {
    localStorage.clear();
    vehicles = jasmine.createSpyObj<VehicleService>('VehicleService', ['getByIds']);
    vehicles.getByIds.and.callFake(ids => of([a, b].filter(v => ids.includes(v.id))));
    TestBed.configureTestingModule({ imports: [CompareComponent], providers: [provideRouter([]),
      { provide: VehicleService, useValue: vehicles },
    ] });
  });
  afterEach(() => localStorage.clear());

  it('thêm yêu thích tự thêm vào compare, không trùng; toggle/remove đồng bộ', () => {
    const favorites = TestBed.inject(FavoriteService);
    const compare = TestBed.inject(CompareService);
    favorites.toggleVehicle(a); favorites.add(favorites.favorites()[0]);
    expect(favorites.favorites().length).toBe(1); expect(compare.ids()).toEqual([1]);
    favorites.toggleVehicle(a);
    expect(favorites.favorites()).toEqual([]); expect(compare.ids()).toEqual([]);
  });

  it('khôi phục favorites/compare sau tạo lại injector; Clear All xóa cả hai', () => {
    TestBed.inject(FavoriteService).toggleVehicle(a);
    TestBed.resetTestingModule();
    const favorites = TestBed.inject(FavoriteService);
    const compare = TestBed.inject(CompareService);
    expect(favorites.favorites().map(v => v.id)).toEqual([1]);
    expect(compare.ids()).toEqual([1]);
    favorites.clear();
    expect(compare.ids()).toEqual([]);
    expect(JSON.parse(localStorage.getItem('favoriteVehicles')!)).toEqual([]);
  });

  it('storage JSON hỏng không làm crash trang favorites/compare', () => {
    localStorage.setItem('favoriteVehicles', '{invalid');
    localStorage.setItem('compareVehicleIds', '{invalid');
    expect(TestBed.inject(FavoriteService).favorites()).toEqual([]);
    expect(TestBed.inject(CompareService).ids()).toEqual([]);
  });

  it('compare tính đúng giá thấp nhất, năm/hp cao nhất và tính lại sau remove', fakeAsync(() => {
    const compare = TestBed.inject(CompareService);
    compare.add(1); compare.add(2);
    const fixture = TestBed.createComponent(CompareComponent);
    fixture.detectChanges(); tick(); fixture.detectChanges();
    const page = fixture.componentInstance;
    expect([...page.winners.price]).toEqual([1]);
    expect([...page.winners.year]).toEqual([2]);
    expect([...page.winners.horsepower]).toEqual([2]);
    page.removeVehicle(2); fixture.detectChanges(); tick(); fixture.detectChanges();
    expect(page.vehicles.map(v => v.id)).toEqual([1]);
    expect(page.winners.price.size).toBe(0);
    page.removeVehicle(1); fixture.detectChanges(); tick(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty-compare')).toBeTruthy();
  }));

  it('compare lỗi tải hiển thị alert và phục hồi khi đổi lựa chọn', fakeAsync(() => {
    const compare = TestBed.inject(CompareService);
    compare.add(1);
    vehicles.getByIds.and.returnValue(throwError(() => new Error('Unavailable')));
    const fixture = TestBed.createComponent(CompareComponent);
    fixture.detectChanges(); tick(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    vehicles.getByIds.and.returnValue(of([a, b]));
    compare.add(2); fixture.detectChanges(); tick(); fixture.detectChanges();
    expect(fixture.componentInstance.error).toBeFalse();
    expect(fixture.componentInstance.vehicles.length).toBe(2);
  }));
});
