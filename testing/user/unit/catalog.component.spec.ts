import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { CarsListingComponent } from '../../../src/app/features/home/cars-listing/cars-listing.component';
import { CarDetailComponent } from '../../../src/app/features/home/car-detail/car-detail.component';
import { VehicleService } from '../../../src/app/core/services/vehicle/vehicle.service';
import { MockVehicleStore } from '../../../src/app/core/mock/mock-vehicle.store';
import { apiPrefixInterceptor } from '../../../src/app/core/interceptors/api-prefix.interceptor';
import { mockApiInterceptor } from '../../../src/app/core/mock/mock-api.interceptor';
import { FavoriteService } from '../../../src/app/core/services/favorite.service';

describe('User — catalog/chi tiết xe qua TestBed', () => {
  let query: Record<string, string>;
  beforeEach(() => {
    localStorage.clear(); query = {};
    TestBed.configureTestingModule({ imports: [CarsListingComponent, CarDetailComponent], providers: [
      provideRouter([]), provideHttpClient(withInterceptors([apiPrefixInterceptor, mockApiInterceptor])),
      { provide: ActivatedRoute, useValue: { snapshot: {
        get queryParamMap() { return convertToParamMap(query); }, paramMap: convertToParamMap({ id: '1' }),
      } } },
    ] });
  });
  afterEach(() => localStorage.clear());

  it('đọc brand/bodyType/price từ URL và chỉ lấy xe available', fakeAsync(() => {
    query = { brand: 'BMW', bodyType: 'Coupe', minPrice: '1000', maxPrice: '100000' };
    const fixture = TestBed.createComponent(CarsListingComponent);
    fixture.detectChanges(); tick(450); fixture.detectChanges();
    const page = fixture.componentInstance;
    expect(page.selectedBrand).toBe('BMW');
    expect(page.minPrice).toBe(1000);
    expect(page.maxPrice).toBe(100000);
    expect(page.cars.map(v => v.id)).toEqual([1]);
    expect(page.cars.every(v => v.status === 'available')).toBeTrue();
    expect(fixture.nativeElement.querySelector('h3').textContent).toContain('BMW M4 Competition');
  }));

  it('lọc kết hợp search/brand/year/price/bodyType, đổi sort và reset toàn bộ', fakeAsync(() => {
    const fixture = TestBed.createComponent(CarsListingComponent);
    fixture.detectChanges(); tick(450);
    const page = fixture.componentInstance;
    const getList = spyOn(TestBed.inject(VehicleService), 'getList').and.callThrough();
    page.currentPage = 2; page.search = ' BMW '; page.selectedBrand = 'BMW';
    page.minPrice = 50000; page.maxPrice = 100000; page.minYear = 2023; page.maxYear = 2024;
    page.bodyTypes = { Coupe: true, SUV: false }; page.sort = 'price-asc';
    page.applyFilters(); tick(450);
    expect(getList).toHaveBeenCalledWith({ search: 'BMW', brand: 'BMW', status: 'available',
      minPrice: 50000, maxPrice: 100000, minYear: 2023, maxYear: 2024,
      bodyTypes: ['Coupe'], sort: 'price-asc', page: 1, pageSize: 6 });
    expect(page.cars.map(v => v.id)).toEqual([1]);
    page.resetFilters(); tick(450);
    expect(page.search).toBe(''); expect(page.selectedBrand).toBe('');
    expect(page.maxPrice).toBeUndefined(); expect(page.minYear).toBeUndefined();
    expect(page.bodyTypes).toEqual({}); expect(page.sort).toBe('newest');
    expect(page.total).toBeGreaterThan(1);
  }));

  it('xe sold không lộ trong catalog và kết quả rỗng có thông báo', fakeAsync(() => {
    const store = TestBed.inject(MockVehicleStore);
    const car = store.getSnapshot().find(v => v.id === 1)!;
    store.update(1, { ...car, status: 'sold' }).subscribe();
    const fixture = TestBed.createComponent(CarsListingComponent);
    fixture.detectChanges(); tick(450);
    fixture.componentInstance.search = 'M4 Competition';
    fixture.componentInstance.searchCars(); tick(450); fixture.detectChanges();
    expect(fixture.componentInstance.total).toBe(0);
    expect(fixture.nativeElement.querySelector('.empty-results')).toBeTruthy();
  }));

  it('phân trang/sort đúng, không gọi API cho trang ngoài phạm vi hoặc trang hiện tại', fakeAsync(() => {
    const fixture = TestBed.createComponent(CarsListingComponent);
    fixture.detectChanges(); tick(450);
    const page = fixture.componentInstance;
    spyOn(window, 'scrollTo');
    const getList = spyOn(TestBed.inject(VehicleService), 'getList').and.callThrough();
    page.goToPage(0); page.goToPage(page.totalPages + 1); page.goToPage(1);
    expect(getList).not.toHaveBeenCalled();
    const first = page.cars.map(v => v.id);
    page.goToPage(2); tick(450);
    expect(page.cars.every(v => !first.includes(v.id))).toBeTrue();
    page.sort = 'price-asc'; page.changeSort(); tick(450);
    expect(page.currentPage).toBe(1);
    const prices = page.cars.map(v => v.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  }));

  it('chi tiết đúng ID, ảnh/specs, yêu thích và chuyển đặt lịch với vehicleId', fakeAsync(() => {
    const fixture = TestBed.createComponent(CarDetailComponent);
    tick(450); fixture.detectChanges();
    const page = fixture.componentInstance;
    expect(page.car?.id).toBe(1);
    expect(page.selectedImage).toBeTruthy();
    expect(page.specifications.some(s => s.label === 'Số lượng trong kho')).toBeTrue();
    page.selectImage('/images/other.jpg'); expect(page.selectedImage).toBe('/images/other.jpg');
    page.toggleFavorite(); expect(TestBed.inject(FavoriteService).isFavorite(1)).toBeTrue();
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    page.scheduleTestDrive();
    expect(navigate).toHaveBeenCalledOnceWith(['/test-drives'], { queryParams: { vehicleId: 1 } });
  }));
});
