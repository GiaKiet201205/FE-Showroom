import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Chặn truy cập mọi route con của /admin nếu:
 * - Chưa đăng nhập -> điều hướng về /login
 * - Đã đăng nhập nhưng không phải role admin -> điều hướng về /login (kèm thông báo)
 *
 * Đăng ký ở app.routes.ts bằng canActivate: [adminGuard] trên route cha /admin,
 * áp dụng cho toàn bộ route con bên trong.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.isAdmin()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { redirectTo: state.url }
  });
};
