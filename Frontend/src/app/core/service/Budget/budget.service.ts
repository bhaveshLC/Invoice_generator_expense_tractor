import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { forkJoin, map } from 'rxjs';
import { ExpenseService } from '../expense/expense.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor() { }
  httpService = inject(HttpService)
  expenseService = inject(ExpenseService)
  getBudgets(params: any) {
    const [year, month] = params.split('-');
    let paramSet = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    return this.httpService.get('budget', paramSet)
  }
  getBudgetSummary(params: any) {
    const [year, month] = params.split('-');
    let paramSet = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    return this.httpService.get('budget/summary', paramSet)
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
