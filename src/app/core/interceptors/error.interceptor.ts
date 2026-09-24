import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

/**
 * Bắt lỗi HTTP tập trung một chỗ: hiển thị thông báo lỗi và
 * ném lại lỗi để component/service gọi tiếp có thể xử lý riêng nếu cần.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';

      if (error.status === 0) {
        message = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.';
      } else if (error.status === 401) {
        message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (error.status === 403) {
        message = 'Bạn không có quyền thực hiện thao tác này.';
      } else if (error.status === 404) {
        message = 'Không tìm thấy dữ liệu yêu cầu.';
      } else if (error.error?.message) {
        message = error.error.message;
      }

      notification.showError(message);
      return throwError(() => error);
    })
  );
};
