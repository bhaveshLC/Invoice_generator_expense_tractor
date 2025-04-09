import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  httpService = inject(HttpService)
  login(body: any) {
    return this.httpService.post('auth/login', body)
  }
  register(body: any) {
    return this.httpService.post('register', body)
  }
  logout() {
    localStorage.removeItem('token')
  }
}
