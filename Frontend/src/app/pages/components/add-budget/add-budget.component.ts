import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService } from '../../../core/service/Budget/budget.service';
import { ToastService } from '../../../core/service/Toast/toast.service';

@Component({
  selector: 'app-add-budget',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-budget.component.html',
  styleUrl: './add-budget.component.css'
})
export class AddBudgetComponent {
  @Input() budget: any;
  @Input() isEditMode: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  budgetForm!: FormGroup;
  submitted = false;
  loading = false;

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  years: number[] = [];
  budgetService = inject(BudgetService)
  toastServie = inject(ToastService)
  constructor(private fb: FormBuilder) {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      this.years.push(i);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.budgetForm = this.fb.group({
      category: [this.budget?.category || "", Validators.required],
      amount: [this.budget?.amount || 0, [Validators.required, Validators.min(1)]],
      month: [this.budget?.month || "", Validators.required],
      year: [this.budget?.year || new Date().getFullYear(), Validators.required],
      notes: [this.budget?.notes || ""],
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.updateBudget()
    } else {
      this.addNewBudget()
    }
    setTimeout(() => {
      this.save.emit();
      this.loading = false;
    }, 500);
  }
  addNewBudget() {
    this.submitted = true;
    if (this.budgetForm.invalid) return;

    this.loading = true;
    this.budgetService.addBudget(this.budgetForm.value).subscribe(res => {
      this.toastServie.showAlert('success', "Created", "New Budget is created")
    }, error => {
      alert(error.error.message)
    })
  }
  updateBudget() {
    this.budgetService.updateBudget(this.budget._id, this.budgetForm.value).subscribe(res => {
      this.save.emit()
      this.toastServie.showAlert('success', "Updated", "Budget is successfully updated")
    })
  }
}
