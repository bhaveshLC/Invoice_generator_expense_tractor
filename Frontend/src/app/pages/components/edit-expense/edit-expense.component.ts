import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../../core/service/expense/expense.service';
import { ToastService } from '../../../core/service/Toast/toast.service';

@Component({
  selector: 'app-edit-expense',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-expense.component.html',
  styleUrl: './edit-expense.component.css'
})
export class EditExpenseComponent {
  error: string = ''
  loading: boolean = false
  @Input() expense: any
  @Output() close = new EventEmitter<void>()
  expenseForm!: FormGroup
  expenseService = inject(ExpenseService)
  toastService = inject(ToastService)
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.expenseForm = this.formBuilder.group({
      title: [this.expense.title || "", Validators.required],
      amount: [this.expense.amount, [Validators.required, Validators.min(0)]],
      category: [this.expense.category || "", Validators.required],
      date: [new Date().toISOString().substr(0, 10), Validators.required],
    })
  }
  onClose() {
    this.close.emit()
  }
  onSubmit() {
    this.expenseService.updateExpense(this.expense._id, this.expenseForm.value).subscribe(res => {
      this.toastService.showAlert('success', "Success", "Expense is updated.");
    }, error => {
      this.toastService.showAlert('error', "Error", error.error.message);
    }, () => {
      this.onClose()
    })
  }
}
