import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/Auth/auth.service';
import { ToastService } from '../../../core/service/Toast/toast.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService, private toastService: ToastService) {
  }

  sendOtp(form: any) {
    if (form.valid) {
      this.isLoading = true;
      this.authService.forgotPassword(this.email).subscribe(res => {
        this.toastService.showAlert('success', 'OTP sent successfully', '')
        this.router.navigateByUrl(`/verify-otp/${this.email}`);
      }, error => {
        console.log(error.error.message)
        this.toastService.showAlert('error', 'Error', error.error.message)
      }, () => {
        this.isLoading = false
      })
    }
  }
}
