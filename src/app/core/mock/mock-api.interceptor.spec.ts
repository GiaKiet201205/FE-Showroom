import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { apiPrefixInterceptor } from '../interceptors/api-prefix.interceptor';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { errorInterceptor } from '../interceptors/error.interceptor';
import { mockApiInterceptor } from './mock-api.interceptor';
import { AuthService } from '../services/auth.service';
import { VehicleService } from '../services/vehicle/vehicle.service';
import { MOCK_ADMIN_CREDENTIALS } from '../services/auth.mock';

describe('Local mock HTTP pipeline', () => {
  let auth: AuthService;
  let vehicles: VehicleService;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [
      provideRouter([{ path: 'loginadmin', children: [] }]),
      provideHttpClient(withInterceptors([apiPrefixInterceptor, authInterceptor, errorInterceptor, mockApiInterceptor])),
      { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } }
    ] });
    auth = TestBed.inject(AuthService);
    vehicles = TestBed.inject(VehicleService);
  });
  afterEach(() => localStorage.clear());

  it('delays responses and cancels pending requests on unsubscribe', fakeAsync(() => {
    const received = jasmine.createSpy('received');
    const subscription = vehicles.getList({ page: 1, pageSize: 10 }).subscribe(received);
    tick(200);
    expect(received).not.toHaveBeenCalled();
    subscription.unsubscribe();
    tick(500);
    expect(received).not.toHaveBeenCalled();
  }));

  it('registers a user, rejects duplicate emails, and allows subsequent login', fakeAsync(() => {
    const credentials = { email: 'new@example.com', password: 'secret123' };
    auth.register({ ...credentials, fullName: 'New User', phone: '0901234567' }).subscribe();
    tick(450);
    expect(auth.currentUser()?.role).toBe('user');
    let available = true;
    auth.emailAvailable(credentials.email).subscribe(result => available = result.available);
    tick(450);
    expect(available).toBeFalse();
    auth.logout();
    auth.login(credentials).subscribe();
    tick(450);
    expect(auth.isLoggedIn()).toBeTrue();
  }));

  it('attaches the session token and creates a vehicle through HttpClient', fakeAsync(() => {
    auth.login(MOCK_ADMIN_CREDENTIALS).subscribe();
    tick(450);
    let createdId = 0;
    vehicles.create({ brand: 'BMW', model: 'Test', year: 2026, price: 100, stockQuantity: 0, color: 'Black', status: 'available' }).subscribe(vehicle => createdId = vehicle.id);
    tick(450);
    expect(createdId).toBeGreaterThan(0);
  }));

  it('handles an expired session centrally and clears authentication', fakeAsync(() => {
    auth.login(MOCK_ADMIN_CREDENTIALS).subscribe();
    tick(450);
    localStorage.setItem('auth_token', 'expired-token');
    let status = 0;
    vehicles.delete(1).subscribe({ error: (error: HttpErrorResponse) => status = error.status });
    tick(450);
    expect(status).toBe(401);
    expect(auth.isLoggedIn()).toBeFalse();
    expect(TestBed.inject(MatSnackBar).open).toHaveBeenCalled();
  }));

  it('returns a deterministic HTTP error for the error demo', fakeAsync(() => {
    let status = 0;
    TestBed.inject(HttpClient).get('/vehicles', { params: { search: '!error' } }).subscribe({ error: (error: HttpErrorResponse) => status = error.status });
    tick(450);
    expect(status).toBe(500);
  }));
});
