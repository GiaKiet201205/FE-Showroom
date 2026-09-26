import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin/dashboard' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },

  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'vehicles',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
        data: { title: 'Quản lý Xe', icon: 'directions_car' }
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
        data: { title: 'Quản lý Người dùng', icon: 'group' }
      },
      {
        path: 'test-drives',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
        data: { title: 'Lịch lái thử', icon: 'event_available' }
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
        data: { title: 'Thương hiệu', icon: 'sell' }
      },
      {
        path: 'sellers',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
        data: { title: 'Người bán', icon: 'storefront' }
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
        data: { title: 'Đơn hàng', icon: 'shopping_cart' }
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
        data: { title: 'Báo cáo', icon: 'description' }
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
        data: { title: 'Cài đặt', icon: 'settings' }
      }
    ]
  },

  { path: '**', redirectTo: 'admin/dashboard' }
];
