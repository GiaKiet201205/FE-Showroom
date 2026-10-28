import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-sign-in',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})

export class SignInComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  submitting = false;
  errorMessage = '';
    private fb = inject(FormBuilder);

    showPassword = false;

    form = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rememberMe: [true],
    });

    get emailInvalid(): boolean {
        const control = this.form.controls.email;
        return control.invalid && (control.dirty || control.touched);
    }

    get passwordInvalid(): boolean {
        const control = this.form.controls.password;
        return control.invalid && (control.dirty || control.touched);
    }

    submit(): void {
        if (this.submitting || this.form.pending) return;
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.submitting = true;
        this.errorMessage = '';
        this.auth.login(this.form.getRawValue()).pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.submitting = false)
        ).subscribe({
          next: () => this.router.navigateByUrl(this.auth.isAdmin() ? '/admin/dashboard' : '/home'),
          error: (error: HttpErrorResponse) => this.errorMessage = error.error?.message ?? 'Không thể hoàn tất yêu cầu.'
        });
    }
}
