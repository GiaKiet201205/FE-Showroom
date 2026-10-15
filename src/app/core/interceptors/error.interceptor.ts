import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** Bắt lỗi HTTP tập trung: báo người dùng, xử lý 401, rồi ném lỗi tiếp cho component. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let message: string;

      switch (err.status) {
        case 0:
          message = 'Không kết nối được máy chủ. Vui lòng kiểm tra mạng.';
          break;
        case 401:
          message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          // Request đăng nhập bị 401 (sai mật khẩu) thì không chuyển hướng
          if (!req.url.includes('/auth/login')) {
            auth.logout();
            router.navigate(['/loginadmin'], { queryParams: { redirectTo: router.url } });
          }
          break;
        case 403:
          message = 'Bạn không có quyền thực hiện thao tác này.';
          break;
        case 404:
          message = 'Không tìm thấy dữ liệu yêu cầu.';
          break;
        default:
          message =
            err.status >= 500
              ? 'Lỗi máy chủ. Vui lòng thử lại sau.'
              : err.error?.message ?? 'Đã có lỗi xảy ra.';
      }

      console.error(`[HTTP ${err.status}] ${req.method} ${req.url}`, err);
      snackBar.open(message, 'Đóng', { duration: 4000 });

      return throwError(() => err);
    })
  );
};