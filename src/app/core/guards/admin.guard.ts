import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.canAccessAdmin()) {
    return true;
  }

  return router.createUrlTree(['/loginadmin'], {
    queryParams: { redirectTo: state.url }
  });
};
