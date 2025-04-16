import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor() { }
  httpService = inject(HttpService)
  getAllExpenses(filters?: any) {
    let paramSet = new HttpParams()
    if (filters) {
      const filter = JSON.stringify(filters);
      paramSet = paramSet.set('filter', filter);
    }
    return this.httpService.get('expense', paramSet);
  }
  getExpenses() {
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
