import { Component } from '@angular/core';
import { AuthService } from '../../../core/service/Auth/auth.service';
import { ToastService } from '../../../core/service/Toast/toast.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-otp',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOTPComponent {
  otp: string = '';
  loading = false;
  error = "";
  email: string = ''
  constructor(private authService: AuthService, private toastService: ToastService,
    private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.email = params['email']
    })
  }
  verifyOTP(e: any) {
    e.preventDefault()
    this.loading = true;
    this.authService.verifyOTP(this.email, this.otp).subscribe((res: any) => {
      this.toastService.showAlert('success', 'OTP verfied  successfully.', '')
      localStorage.setItem('resetToken', res.data)
      this.router.navigateByUrl('/reset-password')
    }, error => {
      this.toastService.showAlert('error', 'Error', error.error.message)
    }, () => {
      this.loading = false
    })
  }
}
