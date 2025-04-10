import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
      id: Math.random().toString(36).substr(2, 9),
      title: this.expenseForm.value.title,
      amount: this.expenseForm.value.amount,
      category: this.expenseForm.value.category,
      date: new Date(this.expenseForm.value.date),
    }

    // Simulate API delay
    setTimeout(() => {
      this.save.emit(expense)
      this.loading = false
    }, 500)
  }
}
