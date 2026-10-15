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
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        // The user sign-in API flow has not been connected to this page yet.
    }
}
