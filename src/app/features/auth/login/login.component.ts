import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  submitting = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get emailInvalid(): boolean {
    const c = this.form.controls.email;
    return c.invalid && (c.dirty || c.touched);
  }

  get passwordInvalid(): boolean {
    const c = this.form.controls.password;
    return c.invalid && (c.dirty || c.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigateByUrl(this.getRedirectUrl());
      },
      error: (error: Error) => {
        this.submitting = false;
        this.errorMessage = error.message;
      }
    });
  }

  private getRedirectUrl(): string {
    const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
    return redirectTo?.startsWith('/admin/') ? redirectTo : '/admin/dashboard';
  }
}
