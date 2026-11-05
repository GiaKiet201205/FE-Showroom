import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleService } from '../../../src/app/core/services/vehicle/vehicle.service';
import { AuthService } from '../../../src/app/core/services/auth.service';
import { MOCK_ADMIN_CREDENTIALS } from '../../../src/app/core/services/auth.mock';
import { apiPrefixInterceptor } from '../../../src/app/core/interceptors/api-prefix.interceptor';
import { authInterceptor } from '../../../src/app/core/interceptors/auth.interceptor';
import { mockApiInterceptor } from '../../../src/app/core/mock/mock-api.interceptor';
import { MockVehicleStore } from '../../../src/app/core/mock/mock-vehicle.store';
import { Vehicle } from '../../../src/app/core/models/vehicle.model';

// Integration via TestBed: real service + interceptors + in-memory mock API, no backend server.
describe('03. Vehicles service — TestBed với mock API thật của ứng dụng', () => {
  let service: VehicleService;
  let auth: AuthService;
  let store: MockVehicleStore;
  const input: Omit<Vehicle, 'id'> = {
    brand: 'BMW', model: 'UNIT FLOW', year: 2024, price: 50000,
    stockQuantity: 3, color: 'Black', status: 'available', imageUrl: '',
  };

  function response<T>(request: Observable<T>): T {
    let value!: T;
    request.subscribe({ next: result => value = result, error: fail });
    tick(450);
    return value;
  }

  function expectError(request: Observable<unknown>, status: number): void {
    const error = jasmine.createSpy('error');
    request.subscribe({ next: () => fail('Request phải bị từ chối'), error });
    tick(450);
    expect(error).toHaveBeenCalledTimes(1);
    expect((error.calls.mostRecent().args[0] as HttpErrorResponse).status).toBe(status);
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([
        apiPrefixInterceptor, authInterceptor, mockApiInterceptor,
      ]))],
    });
    service = TestBed.inject(VehicleService);
    auth = TestBed.inject(AuthService);
    store = TestBed.inject(MockVehicleStore);
  });
  afterEach(() => localStorage.clear());

  it('admin đăng nhập rồi thêm → tìm → sửa → xóa qua service/API', fakeAsync(() => {
    response(auth.login(MOCK_ADMIN_CREDENTIALS));
    expect(auth.canAccessAdmin()).toBeTrue();
    const created = response(service.create(input));
    expect(response(service.getList({ search: input.model, page: 1, pageSize: 10 })).items)
      .toEqual([created]);
    const updated = response(service.update(created.id, { ...input, price: 60000, status: 'sold' }));
    expect(updated.price).toBe(60000);
    expect(response(service.getById(created.id))?.status).toBe('sold');
    response(service.delete(created.id));
    expect(response(service.getList({ search: input.model, page: 1, pageSize: 10 })).total).toBe(0);
  }));

  it('tìm kiếm không phân biệt hoa thường và lọc AND theo brand/status/year', fakeAsync(() => {
    response(auth.login(MOCK_ADMIN_CREDENTIALS));
    const a = response(service.create({ ...input, model: 'UNIT FILTER A' }));
    const b = response(service.create({ ...input, model: 'UNIT FILTER B', year: 2023, status: 'sold' }));
    const c = response(service.create({ ...input, model: 'UNIT FILTER C', brand: 'Audi', status: 'reserved' }));
    const query = { search: '  unit filter  ', page: 1, pageSize: 10 };
    expect(response(service.getList(query)).items.map(v => v.id)).toEqual([c.id, b.id, a.id]);
    expect(response(service.getList({ ...query, brand: 'BMW' })).items.map(v => v.id)).toEqual([b.id, a.id]);
    expect(response(service.getList({ ...query, status: 'reserved' })).items.map(v => v.id)).toEqual([c.id]);
    expect(response(service.getList({ ...query, year: '2023' })).items.map(v => v.id)).toEqual([b.id]);
    expect(response(service.getList({ ...query, brand: 'BMW', status: 'sold', year: '2023' })).items).toEqual([b]);
    expect(response(service.getList({ ...query, brand: 'BMW', status: 'sold', year: '2024' })).total).toBe(0);
  }));

  it('phân trang đúng tổng số và không trùng xe giữa các trang', fakeAsync(() => {
    const first = response(service.getList({ page: 1, pageSize: 2 }));
    const second = response(service.getList({ page: 2, pageSize: 2 }));
    expect(first.total).toBe(store.getSnapshot().length);
    expect(second.total).toBe(first.total);
    expect(first.items.length).toBe(2);
    expect(second.items.length).toBe(2);
    expect(first.items.some(a => second.items.some(b => a.id === b.id))).toBeFalse();
  }));

  it('từ chối thêm/sửa/xóa khi chưa đăng nhập', fakeAsync(() => {
    const before = store.getSnapshot();
    expectError(service.create(input), 401);
    expectError(service.update(before[0].id, input), 401);
    expectError(service.delete(before[0].id), 401);
    expect(store.getSnapshot()).toEqual(before);
  }));

  it('từ chối brand ngoài showroom và tồn kho sai, giữ nguyên dữ liệu', fakeAsync(() => {
    response(auth.login(MOCK_ADMIN_CREDENTIALS));
    const before = store.getSnapshot();
    for (const changes of [{ brand: 'Unknown Brand' }, { stockQuantity: -1 }, { stockQuantity: 1.5 }]) {
      expectError(service.create({ ...input, ...changes }), 400);
      expectError(service.update(before[0].id, { ...input, ...changes }), 400);
    }
    expect(store.getSnapshot()).toEqual(before);
  }));

  it('từ chối xóa xe đã có lịch lái thử', fakeAsync(() => {
    response(auth.login(MOCK_ADMIN_CREDENTIALS));
    const created = response(service.create(input));
    store.retainForBooking(created.id);
    expectError(service.delete(created.id), 409);
    expect(response(service.getById(created.id))).toEqual(created);
  }));

  it('trả 404 khi sửa/xóa xe không tồn tại', fakeAsync(() => {
    response(auth.login(MOCK_ADMIN_CREDENTIALS));
    expectError(service.update(999999, input), 404);
    expectError(service.delete(999999), 404);
  }));

  it('truyền lỗi 500 về caller rồi vẫn tìm kiếm lại được', fakeAsync(() => {
    expectError(service.getList({ search: '!error', page: 1, pageSize: 10 }), 500);
    const result = response(service.getList({ search: 'BMW', page: 1, pageSize: 10 }));
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.every(vehicle => vehicle.brand === 'BMW')).toBeTrue();
  }));
});
