import { Component, inject } from '@angular/core';
import { BudgetService } from '../../core/service/Budget/budget.service';
import { ConfirmationDialogComponent } from "../../core/shared/confirmation-dialog/confirmation-dialog.component";
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AddBudgetComponent } from "../components/add-budget/add-budget.component";
import { ToastService } from '../../core/service/Toast/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-budget-list',
  imports: [FormsModule, CommonModule, CurrencyPipe, ConfirmationDialogComponent, AddBudgetComponent],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.css'
})
export class BudgetListComponent {
  budgets: {
    category: string;
    amount: number;
    period: string;
    startDate: Date;
    endDate: Date;
  }[] = [];
  budgetSummaries: { category: string; spentAmount: number; budgetAmount: number; percentageSpent: number; remainingAmount: number; }[] = [];
  showBudgetModal = false
  showDeleteConfirmation = false
  currentBudget: any
  isEditMode = false
  loading = false
  toastService = inject(ToastService)
  availableYears: number[] = []
  selectedMonth: any
  selectedYear: any
  constructor(private budgetService: BudgetService) { }
  month_Year: any
  ngOnInit(): void {
    this.initializeMonthYear()
    this.loadBudgets()
    this.loadBudgetSummaries()
  }

  loadBudgets(): void {
    this.loading = true
    this.budgetService.getBudgets(this.month_Year).subscribe({
      next: (res: any) => {
        this.budgets = res.data.budgets.map((budget: any) => ({
          ...budget,
          period: this.getMonthYearString(budget.month, budget.year),
        }));
      },
      error: (err) => {
        console.error('Error loading budgets:', err);
      }
    });
  }
  initializeMonthYear() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    this.month_Year = `${year}-${month}`;
  }

  onMonthChange() {
    this.loadBudgets();
    this.loadBudgetSummaries()
  }
  loadBudgetSummaries(): void {
    console.log(this.month_Year)
    this.budgetService.getBudgetSummary(this.month_Year).subscribe(
      (res: any) => {
        console.log(res)
        this.budgetSummaries = res.data
        console.log('summary', this.budgetSummaries)
        this.loading = false
      },
      (error) => {
        console.error("Error loading budget summaries", error)
        this.loading = false
      },
    )
  }

  openAddBudgetModal(): void {
    this.currentBudget = null
    this.isEditMode = false
    this.showBudgetModal = true
  }

  editBudget(budget: any): void {
    this.currentBudget = { ...budget }
    this.isEditMode = true
    this.showBudgetModal = true
  }

  closeBudgetModal(): void {
    this.showBudgetModal = false
  }

  saveBudget(): void {
    this.closeBudgetModal();
    this.loadBudgets();
    this.loadBudgetSummaries()
  }

  confirmDeleteBudget(budget: any): void {
    this.currentBudget = budget
    this.showDeleteConfirmation = true
    console.log(this.showDeleteConfirmation)
  }

  deleteBudget(): void {
    if (this.currentBudget) {
      this.budgetService.deleteBudget(this.currentBudget._id).subscribe(res => {
        this.loadBudgetSummaries()
        this.loadBudgets()
        this.showDeleteConfirmation = false;
        this.toastService.showAlert('success', 'Deleted', 'Budget is deleted')
      }, error => {
        this.toastService.showAlert('error', 'Error', error.error.message)
        this.showDeleteConfirmation = false;
      })
    }
  }

  cancelDeleteBudget(): void {
    this.showDeleteConfirmation = false
    this.currentBudget = null
  }
  getMonthYearString(month: number, year: number): string {
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

}
