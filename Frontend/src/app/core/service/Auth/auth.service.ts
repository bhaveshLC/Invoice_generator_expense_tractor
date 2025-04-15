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
    return this.httpService.post('register', body)
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
