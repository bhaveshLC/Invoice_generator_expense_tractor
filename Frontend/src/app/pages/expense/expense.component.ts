import { Component } from '@angular/core';
import { AddExpenseComponent } from "../components/add-expense/add-expense.component";
import { CommonModule, DatePipe } from '@angular/common';
import { ExpenseService } from '../../core/service/expense/expense.service';

@Component({
  selector: 'app-expense',
  imports: [CommonModule, AddExpenseComponent, DatePipe],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent {
  expenses: any[] = []
  showAddExpenseModal = false

  constructor(private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.loadExpenses()
  }

  loadExpenses(): void {
    this.expenseService.getAllExpenses().subscribe(
      (res: any) => {
        this.expenses = res.data.expenses
      },
      (error) => {
        console.error("Error loading expenses", error)
      },
    )
  }

  openAddExpenseModal(): void {
    this.showAddExpenseModal = true
  }

  closeAddExpenseModal(): void {
    this.showAddExpenseModal = false
  }

  saveExpense(expense: any): void {
    // this.expenseService.createExpense(expense).subscribe(
    //   (newExpense: Expense) => {
    //     this.expenses.push(newExpense)
    //     this.closeAddExpenseModal()
    //   },
    //   (error) => {
    //     console.error("Error creating expense", error)
    //   },
    // )
  }
}
