import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Tài khoản Admin cố định (chưa có backend thật).
// Muốn đổi email/mật khẩu, chỉ cần sửa 2 dòng này.
const FIXED_ADMIN_EMAIL = 'admin@giakiet.com';
const FIXED_ADMIN_PASSWORD = 'admin123';

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

    const { email, password } = this.form.getRawValue();

    // So khớp với tài khoản Admin cố định — đúng cả 2 mới cho vào.
    if (email !== FIXED_ADMIN_EMAIL || password !== FIXED_ADMIN_PASSWORD) {
      this.submitting = false;
      this.errorMessage = 'Email hoặc mật khẩu không đúng.';
      return;
    }

    this.auth.loginAsAdmin();
    this.submitting = false;
    this.router.navigateByUrl('/admin/dashboard');
  }
}