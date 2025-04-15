import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }
  httpService = inject(HttpService)
  getDashboard() {
    return this.httpService.get("dashboard")
  }

}
