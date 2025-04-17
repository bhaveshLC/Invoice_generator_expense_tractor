import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-form',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.css'
})
export class InvoiceFormComponent {
  @Output() save = new EventEmitter<any>()
  @Output() cancel = new EventEmitter<void>()

  @Input() invoice: any
  @Input() isEditMode = false

  invoiceForm!: FormGroup
  submitted = false
  subtotal = 0
  taxAmount = 0
  total = 0

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm(): void {
    const invoiceDate =
      this.isEditMode && this.invoice?.invoiceDate
        ? new Date(this.invoice.invoiceDate).toISOString().substr(0, 10)
        : new Date().toISOString().substr(0, 10)

    const dueDate =
      this.isEditMode && this.invoice?.dueDate
        ? new Date(this.invoice.dueDate).toISOString().substr(0, 10)
        : this.getDefaultDueDate()

    this.invoiceForm = this.fb.group({
      clientName: [this.isEditMode ? this.invoice?.clientName : "", Validators.required],
      clientEmail: [this.isEditMode ? this.invoice?.clientEmail : "", [Validators.required, Validators.email]],
      clientAddress: [this.isEditMode ? this.invoice?.clientAddress : "", Validators.required],
      invoiceDate: [invoiceDate, Validators.required],
      dueDate: [dueDate, Validators.required],
      items: this.fb.array([]),
      taxRate: [this.isEditMode ? this.invoice?.taxRate : 0, [Validators.required, Validators.min(0)]],
      discount: [this.isEditMode ? this.invoice?.discount : 0, [Validators.required, Validators.min(0)]],
      status: [this.isEditMode ? this.invoice?.status : "Unpaid", Validators.required],
      note: [this.isEditMode ? this.invoice?.note : ""],
    })

    while (this.items.length) {
      this.items.removeAt(0)
    }

    if (this.isEditMode && this.invoice?.items && this.invoice.items.length > 0) {
      this.invoice.items.forEach((item: any) => {
        this.items.push(
          this.fb.group({
            itemName: [item.itemName, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            price: [item.price, [Validators.required, Validators.min(0)]],
          }),
        )
      })
    } else {
      this.addItem()
    }
    this.calculateTotals()
  }

  get f() {
    return this.invoiceForm.controls
  }

  get items() {
    return this.f['items'] as FormArray
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      itemName: ["", Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    })

    this.items.push(itemGroup)
    this.calculateTotals()
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index)
      this.calculateTotals()
    } else {
      alert("Invoice must have at least one item")
    }
  }

  calculateTotals(): void {
    this.subtotal = 0

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items.at(i) as FormGroup
      const quantity = item.get("quantity")?.value || 0
      const price = item.get("price")?.value || 0
      this.subtotal += quantity * price
    }

    const taxRate = this.invoiceForm.get("taxRate")?.value || 0
    this.taxAmount = this.subtotal * (taxRate / 100)

    const discount = this.invoiceForm.get("discount")?.value || 0
    this.total = this.subtotal + this.taxAmount - discount
  }

  getDefaultDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 10)
    return date.toISOString().substr(0, 10)
  }

  onSubmit(): void {
    this.submitted = true

    if (this.invoiceForm.invalid) {
      return
    }

    const formValue = this.invoiceForm.value
    const invoice = {
      id: this.isEditMode && this.invoice ? this.invoice.id : Math.random().toString(36).substr(2, 9),
      clientName: formValue.clientName,
      clientEmail: formValue.clientEmail,
      clientAddress: formValue.clientAddress,
      invoiceDate: new Date(formValue.invoiceDate),
      dueDate: new Date(formValue.dueDate),
      items: formValue.items,
      taxRate: formValue.taxRate,
      discount: formValue.discount,
      status: formValue.status,
      subtotal: this.subtotal,
      taxAmount: this.taxAmount,
      total: this.total,
      note: formValue.note,
    }

    this.save.emit(invoice)
  }
}
