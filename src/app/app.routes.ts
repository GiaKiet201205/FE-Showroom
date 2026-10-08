  import { Routes } from '@angular/router';
  import { SignInComponent } from './features/auth/pages/sign-in/sign-in.component';
  import { SignUpComponent } from './features/auth/pages/sign-up/sign-up.component';
  import { ForgotPasswordComponent } from './features/auth/pages/forgot-password/forgot-password.component';
  import { adminGuard } from './core/guards/admin.guard';

  export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },

    {
      path: 'login',
      loadComponent: () =>
        import('./features/auth/pages/sign-in/sign-in.component').then(
          (m) => m.SignInComponent,
        ),
    },
    { path: 'sign-in', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
// ============================= User =========================================
    {
      path: '',

      loadComponent: () =>
        import('./shared/user-layout/user-layout.component').then((m) => m.UserLayoutComponent),
      children: [

        // / -> /home
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'home'
        },

        // /home
        {
          path: 'home',

          loadComponent: () =>
            import('./features/home/home.component').then(
              (m) => m.HomeComponent
            ),
        },

        // /cars
        {
          path: 'cars',

          loadComponent: () =>
            import(
              './features/home/cars-listing/cars-listing.component'
            ).then(
              (m) => m.CarsListingComponent
            ),
        },

        {
          path: 'cars/:id',
          loadComponent: () =>
            import('./features/home/car-detail/car-detail.component').then(
              (m) => m.CarDetailComponent
            ),
        },

        {
          path: 'brands',

          loadComponent: () =>
            import('./features/home/brands/brands.component').then(
              (m) => m.BrandsComponent
            ),
        },
        {
          path: 'compare',

          loadComponent: () =>
            import('./features/home/compare/compare.component').then(
              (m) => m.CompareComponent
            ),
        },
        {
          path: 'favorites',

          loadComponent: () =>
            import('./features/home/favorites/favorites.component').then(
              (m) => m.FavoritesComponent
            ),
        },
        {
          path: 'test-drives',

          loadComponent: () =>
            import(
              './features/home/test-drives/test-drives.component'
            ).then(
              (m) => m.TestDrivesComponent
            ),
        },
        {
          path: 'services',

          loadComponent: () =>
            import('./features/home/services/services.component').then(
              (m) => m.ServicesComponent
            ),
        },
        {
          path: 'about',

          loadComponent: () =>
            import('./features/home/about/about.component').then(
              (m) => m.AboutComponent
            ),
        },
        {
          path: 'contact',

          loadComponent: () =>
            import('./features/home/contact/contact.component').then(
              (m) => m.ContactComponent
            ),
        },
        {
          path: 'profile',

          loadComponent: () =>
            import('./features/home/profile/profile.component').then(
              (m) => m.ProfileComponent
            ),
        },

      ],
    },
// ============================= Login Admin =================================
    {
      path: 'loginadmin',
      loadComponent: () =>
        import('./features/auth/login/login.component').then(
          (m) => m.LoginComponent,
        ),
    },
// ============================= Admin =========================================
    {
      path: 'admin',
      canActivate: [adminGuard],
      loadComponent: () =>
        import('./features/admin/layout/admin-layout.component').then(
          (m) => m.AdminLayoutComponent,
        ),
      children: [
        { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
        {
          path: 'dashboard',
          loadComponent: () =>
            import('./features/admin/dashboard/dashboard.component').then(
              (m) => m.DashboardComponent,
            ),
        },
        {
          path: 'vehicles',
          loadComponent: () =>
            import('./features/admin/vehicles/vehicles.component').then(
              (m) => m.AdminVehiclesComponent,
            ),
          data: { title: 'Quản lý Xe', icon: 'directions_car' },
        },
        {
          path: 'users',
          loadComponent: () =>
            import('./features/admin/users/users.component').then(
              (m) => m.AdminUsersComponent,
            ),
          data: { title: 'Quản lý Người dùng', icon: 'group' },
        },
        {
          path: 'test-drives',
          loadComponent: () =>
            import('./features/admin/test-drives/test-drives.component').then(
              (m) => m.AdminTestDrivesComponent,
            ),
          data: { title: 'Lịch lái thử', icon: 'event_available' },
        },
        {
          path: 'brands',
          loadComponent: () =>
            import('./features/admin/brands/brands.component').then(
              (m) => m.AdminBrandsComponent,
            ),
          data: { title: 'Thương hiệu', icon: 'sell' },
        },
        {
          path: 'sellers',
          loadComponent: () =>
            import('./features/admin/sellers/sellers.component').then(
              (m) => m.AdminSellersComponent,
            ),
          data: { title: 'Người bán', icon: 'storefront' },
        },
        {
          path: 'orders',
          loadComponent: () =>
            import('./shared/components/coming-soon/coming-soon.component').then(
              (m) => m.ComingSoonComponent,
            ),
          data: { title: 'Đơn hàng', icon: 'shopping_cart' },
        },
        {
          path: 'reports',
          loadComponent: () =>
            import('./features/admin/reports/reports.component').then(
              (m) => m.AdminReportsComponent,
            ),
          data: { title: 'Báo cáo', icon: 'description' },
        },
        {
          path: 'settings',
          loadComponent: () =>
            import('./shared/components/coming-soon/coming-soon.component').then(
              (m) => m.ComingSoonComponent,
            ),
          data: { title: 'Cài đặt', icon: 'settings' },
        },
      ],
    },

    { path: '**', redirectTo: '' },
  ];