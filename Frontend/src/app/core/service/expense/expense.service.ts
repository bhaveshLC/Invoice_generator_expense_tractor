import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor() { }
  httpService = inject(HttpService)
  getAllExpenses() {
    return this.httpService.get('expense');
  }
  addExpense(data: any) {
    return this.httpService.post('expense', data);
  }
  updateExpense(id: string, data: any) {
    return this.httpService.put(`expense/${id}`, data);
  }
  removeExpense(id: string) {
    return this.httpService.delete(`expense/${id}`)
  }
}
