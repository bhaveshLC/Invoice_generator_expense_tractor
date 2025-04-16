import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../../core/service/expense/expense.service';
import { ToastService } from '../../../core/service/Toast/toast.service';

@Component({
  selector: 'app-add-expense',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css'
})
export class AddExpenseComponent {
  @Output() close = new EventEmitter<void>()
  @Output() save = new EventEmitter<any>()

  expenseForm: FormGroup | any
  loading = false
  expenseService = inject(ExpenseService)
  toastService = inject(ToastService)
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.expenseForm = this.formBuilder.group({
      title: ["", Validators.required],
      amount: ["", [Validators.required, Validators.min(0)]],
      category: ["", Validators.required],
      date: [new Date().toISOString().substr(0, 10), Validators.required],
    })
  }

  onClose(): void {
    this.close.emit()
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) {
      return
    }

    this.loading = true

    const expense: any = {
      title: this.expenseForm.value.title,
      amount: this.expenseForm.value.amount,
      category: this.expenseForm.value.category,
      date: new Date(this.expenseForm.value.date),
    }
    this.expenseService.addExpense(expense).subscribe(res => {
      this.toastService.showAlert('success', 'Success', 'New Expense is added')
      this.save.emit()
      this.loading = false
    }, error => {
      this.toastService.showAlert('error', 'Error', error.error.message)
    })
  }
}
