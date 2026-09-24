import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Tự động thêm tiền tố environment.apiUrl vào các request có đường dẫn tương đối.
 * Ví dụ: this.http.get('/users') -> GET http://localhost:8080/api/users
 */
export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  const isAbsoluteUrl = /^https?:\/\//i.test(req.url);

  if (isAbsoluteUrl) {
    return next(req);
  }

  const apiUrl = environment.apiUrl.replace(/\/$/, '');
  const path = req.url.startsWith('/') ? req.url : `/${req.url}`;

  return next(req.clone({ url: `${apiUrl}${path}` }));
};
