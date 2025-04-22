import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  httpService = inject(HttpService)
  router = inject(Router)
  login(body: any) {
    return this.httpService.post('auth/login', body)
  }
  register(body: any) {
    return this.httpService.post('auth/register', body)
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  forgotPassword(email: string) {
    return this.httpService.post('auth/forgot-password', { email })
  }
  verifyOTP(email: string, otp: string) {
    return this.httpService.post('auth/verify-otp', { email, otp })
  }
  resetPassword(resetToken: string, password: string) {
    return this.httpService.post('auth/reset-password', { resetToken, password })
  }
}
