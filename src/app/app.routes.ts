import { Route, Routes } from '@angular/router';
import { SignInComponent } from './features/auth/pages/sign-in/sign-in.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin/dashboard' },

  {
    path: 'sign-in',
    component: SignInComponent,
  },

  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: '',
    component: HomeComponent,
  },
];
