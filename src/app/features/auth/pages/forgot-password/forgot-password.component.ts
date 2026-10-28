import { Component, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  form = inject(FormBuilder).nonNullable.group({ email: ['', [Validators.required, Validators.email]] });
  submitting = false;
  message = '';
  submit(): void {
    if (this.submitting) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.message = '';
    this.auth.forgotPassword(this.form.getRawValue().email).pipe(
      takeUntilDestroyed(this.destroyRef), finalize(() => this.submitting = false)
    ).subscribe({
      next: result => this.message = result.message,
      error: () => this.message = 'Không thể xử lý yêu cầu. Vui lòng thử lại.'
    });
  }
}
