import { Component } from '@angular/core';
import { AddExpenseComponent } from "../components/add-expense/add-expense.component";
import { CommonModule, DatePipe } from '@angular/common';
import { ExpenseService } from '../../core/service/expense/expense.service';
import { ConfirmationDialogComponent } from "../../core/shared/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-expense',
  imports: [CommonModule, AddExpenseComponent, DatePipe, ConfirmationDialogComponent],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent {
  expenses: any[] = []
  showAddExpenseModal = false
  showDeleteConfirmation = false
  currentExpense: any
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

  saveExpense() {
    this.closeAddExpenseModal()
    this.loadExpenses()
  }
  confirmDeleteInvoice(invoice: any): void {
    this.currentExpense = invoice
    this.showDeleteConfirmation = true
  }
  deleteExpense(): void {
    if (this.currentExpense) {
      console.log(this.currentExpense)
      this.expenseService.removeExpense(this.currentExpense._id).subscribe(
        () => {
          this.loadExpenses()
          this.cancelDeleteExpense()
        },
        (error) => {
          console.error("Error deleting invoice", error)
        },
      )
    }
  }

  cancelDeleteExpense(): void {
    this.showDeleteConfirmation = false
    this.currentExpense = null
  }
}
