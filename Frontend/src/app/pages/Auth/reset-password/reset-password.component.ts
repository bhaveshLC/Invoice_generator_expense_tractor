import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/Auth/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/service/Toast/toast.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  isLoading: boolean = false
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.resetForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validator: this.passwordsMatch }
    );
  }

  passwordsMatch(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  resetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { newPassword } = this.resetForm.value;
    const resetToken = localStorage.getItem('resetToken');

    if (!resetToken) {
      this.toastService.showAlert('error', 'Error', 'Reset token missing. Please try again.');
      this.router.navigate(['/forgot-password']);
      return;
    }
    this.isLoading = true
    this.authService.resetPassword(resetToken, newPassword).subscribe({
      next: () => {
        this.toastService.showAlert('success', 'Success', 'Password updated successfully!');
        localStorage.removeItem('resetToken');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.toastService.showAlert('error', 'Error', err.error.message);
      },
      complete: () => {
        this.isLoading = false
      }
    });
  }
}
