import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

import { apiPrefixInterceptor } from './api-prefix.interceptor';
import { authInterceptor } from './auth.interceptor';
import { errorInterceptor } from './error.interceptor';

describe('Chuong 8 - HttpClient va HTTP Interceptors', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  let getTokenSpy: jasmine.Spy;
  let logoutSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;
  let snackBarSpy: jasmine.Spy;

  const endpoint = '/admin/dashboard/overview';
  const expectedUrl = `${environment.apiUrl}${endpoint}`;

  beforeEach(() => {
    getTokenSpy = jasmine.createSpy('getToken').and.returnValue(null);

    logoutSpy = jasmine.createSpy('logout');

    navigateSpy = jasmine
      .createSpy('navigate')
      .and.returnValue(Promise.resolve(true));

    snackBarSpy = jasmine.createSpy('open');

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            apiPrefixInterceptor,
            authInterceptor,
            errorInterceptor,
          ]),
        ),
        provideHttpClientTesting(),

        {
          provide: AuthService,
          useValue: {
            getToken: getTokenSpy,
            logout: logoutSpy,
          },
        },
        {
          provide: Router,
          useValue: {
            url: '/admin/dashboard',
            navigate: navigateSpy,
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarSpy,
          },
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);

    spyOn(console, 'error');
  });

  afterEach(() => {
    httpTesting.verify();
  });

  function sendGetRequest() {
    http.get(endpoint).subscribe({
      error: () => {},
    });

    return httpTesting.expectOne(expectedUrl);
  }

  it('01 - GET dung URL va khong co token', () => {
    const req = sendGetRequest();

    expect(req.request.method).toBe('GET');
    expect(req.request.url).toBe(expectedUrl);

    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  });

  it('02 - Request co Authorization Bearer demo-token', () => {
    getTokenSpy.and.returnValue('demo-token');

    const req = sendGetRequest();

    expect(req.request.headers.get('Authorization')).toBe('Bearer demo-token');

    req.flush({});
  });

  it('03 - HTTP 401 goi logout va chuyen trang', () => {
    const req = sendGetRequest();

    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(logoutSpy).toHaveBeenCalled();

    expect(navigateSpy).toHaveBeenCalledWith(['/loginadmin'], {
      queryParams: {
        redirectTo: '/admin/dashboard',
      },
    });

    expect(snackBarSpy).toHaveBeenCalled();
  });

  it('04 - HTTP 401 tai login khong tu dong redirect', () => {
    http.post('/auth/login', {}).subscribe({
      error: () => {},
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/auth/login`);

    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(logoutSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('05 - HTTP 403 hien thong bao khong co quyen', () => {
    const req = sendGetRequest();

    req.flush({}, { status: 403, statusText: 'Forbidden' });

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Bạn không có quyền thực hiện thao tác này.',
      'Đóng',
      { duration: 4000 },
    );
  });

  it('06 - HTTP 404 hien thong bao khong tim thay', () => {
    const req = sendGetRequest();

    req.flush({}, { status: 404, statusText: 'Not Found' });

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Không tìm thấy dữ liệu yêu cầu.',
      'Đóng',
      { duration: 4000 },
    );
  });

  it('07 - HTTP 500 hien thong bao loi may chu', () => {
    const req = sendGetRequest();

    req.flush({}, { status: 500, statusText: 'Server Error' });

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Lỗi máy chủ. Vui lòng thử lại sau.',
      'Đóng',
      { duration: 4000 },
    );
  });

  it('08 - Loi ket noi status 0', () => {
    const req = sendGetRequest();

    req.error(new ProgressEvent('error'));

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Không kết nối được máy chủ. Vui lòng kiểm tra mạng.',
      'Đóng',
      { duration: 4000 },
    );
  });
});
