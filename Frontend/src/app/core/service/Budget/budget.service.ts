import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { forkJoin, map } from 'rxjs';
import { ExpenseService } from '../expense/expense.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor() { }
  httpService = inject(HttpService)
  expenseService = inject(ExpenseService)
  getBudgets() {
    return this.httpService.get('budget')
  }
  getBudgetSummary() {
    return this.httpService.get('budget/summary')
  }
  addBudget(data: any) {
    return this.httpService.post('budget', data)
  }
  updateBudget(id: string, data: any) {
    return this.httpService.put(`budget/${id}`, data)
  }
  deleteBudget(id: string) {
    return this.httpService.delete(`budget/${id}`)
  }
}
