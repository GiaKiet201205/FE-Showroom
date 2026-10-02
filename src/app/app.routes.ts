import { Route, Routes } from '@angular/router';
import { SignInComponent } from './features/auth/pages/sign-in/sign-in.component';

export const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
  },

  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
];
