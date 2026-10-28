import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize, timer, switchMap, map, catchError, of } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  submitting = false;
  errorMessage = '';
  private fb = inject(FormBuilder);

  showPassword = false;

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [(control: AbstractControl) => timer(300).pipe(
        switchMap(() => this.auth.emailAvailable(String(control.value))),
        map(result => result.available ? null : { emailTaken: true }),
        catchError(() => of({ emailCheckFailed: true }))
      )],
      updateOn: 'blur'
    }],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9()\s-]{7,20}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    acceptTerms: [false, Validators.requiredTrue],
  }, { validators: passwordsMatch });

  isInvalid(field: 'fullName' | 'email' | 'phone' | 'password' | 'confirmPassword' | 'acceptTerms'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }

  get confirmPasswordInvalid(): boolean {
    const control = this.form.controls.confirmPassword;
    return (control.invalid || this.form.hasError('passwordMismatch')) && (control.dirty || control.touched);
  }

  submit(): void {
    if (this.submitting || this.form.pending) return;
        if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
        this.errorMessage = '';
        this.auth.register(this.form.getRawValue()).pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.submitting = false)
        ).subscribe({
          next: () => this.router.navigateByUrl(this.auth.isAdmin() ? '/admin/dashboard' : '/home'),
          error: (error: HttpErrorResponse) => this.errorMessage = error.error?.message ?? 'Không thể hoàn tất yêu cầu.'
        });
  }
}
