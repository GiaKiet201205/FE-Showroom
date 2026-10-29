import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map, switchMap, timer } from 'rxjs';
import { MockVehicleStore, VehicleQuery } from './mock-vehicle.store';
import { MockAuthStore } from './mock-auth.store';
import { Vehicle } from '../models/vehicle.model';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { environment } from '../../../environments/environment';

// Terminal interceptor: API requests are handled locally, without a network server.
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const base = environment.apiUrl.replace(/\/$/, '');
  if (!req.url.startsWith(`${base}/`)) return next(req);
  const path = req.url.slice(base.length);
  const vehicles = inject(MockVehicleStore);
  const auth = inject(MockAuthStore);
  // Work starts after the timer: unsubscription cancels pending work, including writes.
  return timer(450).pipe(switchMap(() => {
    const fail = (status: number, message: string): never => {
      throw new HttpErrorResponse({ status, url: req.url, error: { message } });
    };
    const response = (body: unknown) => new HttpResponse({ status: 200, body });
    if (path === '/auth/login') return [response(auth.login(req.body as LoginRequest))];
    if (path === '/auth/register') return [response(auth.register(req.body as RegisterRequest))];
    if (path === '/auth/email-available') return [response({ available: auth.emailAvailable(req.params.get('email') ?? '') })];
    if (path === '/auth/forgot-password') return [response({ message: 'Yêu cầu đặt lại mật khẩu đã được mô phỏng. Không có email thực được gửi.' })];
    if (path.startsWith('/vehicles')) {
      if (req.method !== 'GET' && !auth.isAdminToken(req.headers.get('Authorization'))) {
        return fail(401, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');
      }
      // Deterministic error scenario for exercising the shared HTTP error handler.
      if (req.params.get('search') === '!error') return fail(500, 'Lỗi dữ liệu giả lập.');
      if (path === '/vehicles/body-types' && req.method === 'GET') return vehicles.getBodyTypes().pipe(map(response));
      if (path === '/vehicles/featured') return vehicles.getFeatured(Number(req.params.get('limit') ?? 4)).pipe(map(response));
      if (path === '/vehicles/selection') return vehicles.getByIds((req.params.get('ids') ?? '').split(',').map(Number)).pipe(map(response));
      if (path === '/vehicles' && req.method === 'GET') {
        const numberParam = (key: string) => req.params.has(key) ? Number(req.params.get(key)) : undefined;
        const query: VehicleQuery = {
          search: req.params.get('search') ?? undefined,
          brand: req.params.get('brand') ?? undefined,
          status: req.params.get('status') ?? undefined,
          year: req.params.get('year') ?? undefined,
          condition: req.params.get('condition') ?? undefined,
          sort: req.params.get('sort') ?? undefined,
          minPrice: numberParam('minPrice'), maxPrice: numberParam('maxPrice'),
          minYear: numberParam('minYear'), maxYear: numberParam('maxYear'),
          bodyTypes: req.params.get('bodyTypes')?.split(',').filter(Boolean),
          page: numberParam('page') ?? 1, pageSize: numberParam('pageSize') ?? 10
        };
        return vehicles.getList(query).pipe(map(response));
      }
      if (path === '/vehicles' && req.method === 'POST') return vehicles.create(req.body as Omit<Vehicle, 'id'>).pipe(map(response));
      const match = /^\/vehicles\/(\d+)$/.exec(path);
      if (match) {
        const id = Number(match[1]);
        return vehicles.getById(id).pipe(switchMap(vehicle => {
          if (!vehicle) return fail(404, 'Không tìm thấy xe.');
          if (req.method === 'GET') return [response(vehicle)];
          if (req.method === 'PUT') return vehicles.update(id, req.body as Omit<Vehicle, 'id'>).pipe(map(response));
          if (req.method === 'DELETE') return vehicles.delete(id).pipe(map(response));
          return fail(405, 'Thao tác không được hỗ trợ.');
        }));
      }
    }
    return fail(404, 'API mock chưa được triển khai.');
  }));
};
