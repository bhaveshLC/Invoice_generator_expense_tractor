import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-invoice',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-invoice.component.html',
  styleUrl: './edit-invoice.component.css'
})
export class EditInvoiceComponent {
  @Input() invoice: any
  @Output() close = new EventEmitter<void>()
  @Output() save = new EventEmitter<any>()

  invoiceForm: FormGroup | any
  loading = false

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm()
  }


  initForm(): void {
    console.log(this.invoice)
    this.invoiceForm = this.formBuilder.group({
      clientName: [this.invoice?.clientName || "", Validators.required],
      total: [this.invoice?.total || "", [Validators.required, Validators.min(0)]],
      category: [this.invoice?.category || "", Validators.required],
      notes: [this.invoice?.notes || ""],
    })
  }

  onClose(): void {
    this.close.emit()
  }

  onSubmit(): void {
    if (this.invoiceForm.invalid) {
      return
    }

    this.loading = true

    const invoiceData: Partial<any> = {
      clientName: this.invoiceForm.value.clientName,
      clientEmail: this.invoice?.clientEmail,
      clientAddress: this.invoice?.clientAddress,
      amount: this.invoiceForm.value.amount,
      category: this.invoiceForm.value.category,
      notes: this.invoiceForm.value.notes,
      date: this.invoice?.date || new Date(),
      status: this.invoice?.status || "Unpaid",
    }

    setTimeout(() => {
      this.save.emit(invoiceData as any)
      this.loading = false
    }, 500)
  }
}
