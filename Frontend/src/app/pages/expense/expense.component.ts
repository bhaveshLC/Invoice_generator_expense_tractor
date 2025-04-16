import { Component } from '@angular/core';
import { AddExpenseComponent } from "../components/add-expense/add-expense.component";
import { CommonModule, DatePipe } from '@angular/common';
import { ExpenseService } from '../../core/service/expense/expense.service';
import { ConfirmationDialogComponent } from "../../core/shared/confirmation-dialog/confirmation-dialog.component";
import { category } from '../../Evironment';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from "../../core/shared/pagination/pagination.component";

@Component({
  selector: 'app-expense',
  imports: [FormsModule, CommonModule, AddExpenseComponent, DatePipe, ConfirmationDialogComponent, PaginationComponent],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent {
  expenses: any[] = []
  showAddExpenseModal = false
  showDeleteConfirmation = false
  currentExpense: any
  categories = category;
  filters = {
    minPrice: 0,
    category: '',
    monthYear: '',
    page: 1,
  }
  pages: number[] = []
  constructor(private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.initializeMonthYear()
    this.loadExpenses()
  }
  initializeMonthYear() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    this.filters.monthYear = `${year}-${month}`;
  }
  loadExpenses(): void {
    this.expenseService.getAllExpenses(this.filters).subscribe(
      (res: any) => {
        this.expenses = res.data.expenses
        this.filters.page = res.data.page
        this.pages = Array.from({ length: res.data.totalPages }, (_, i) => i + 1)
      },
      (error) => {
        console.error("Error loading expenses", error)
      },
    )
  }
  applyFilters() {
    this.loadExpenses()
  }
  onpageChange(e: any) {
    this.filters.page = e
    this.loadExpenses()
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
