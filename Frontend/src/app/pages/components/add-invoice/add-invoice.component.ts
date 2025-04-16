import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvoiceService } from '../../../core/service/invoice/invoice.service';
import { ToastService } from '../../../core/service/Toast/toast.service';
interface InvoiceItem {
  itemName: string
  quantity: number
  price: number
}

interface Invoice {
  clientName: string
  clientEmail: string
  clientAddress: string
  invoiceDate: string
  dueDate: string
  items: InvoiceItem[]
  taxRate: number
  discount: number
  status: string
}

@Component({
  selector: 'app-add-invoice',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-invoice.component.html',
  styleUrl: './add-invoice.component.css'
})
export class AddInvoiceComponent {
  invoiceForm!: FormGroup
  currentStep = 1
  subtotal = 0
  taxAmount = 0
  discountAmount = 0
  grandTotal = 0
  error = ''
  constructor(private fb: FormBuilder) { }
  invoiceService = inject(InvoiceService)
  toastService = inject(ToastService)
  ngOnInit(): void {
    this.initForm()
    this.calculateTotals()

    this.items.valueChanges.subscribe(() => {
      this.calculateTotals()
    })

    this.invoiceForm.get("taxRate")?.valueChanges.subscribe(() => {
      this.calculateTotals()
    })

    this.invoiceForm.get("discount")?.valueChanges.subscribe(() => {
      this.calculateTotals()
    })
  }

  initForm(): void {
    this.invoiceForm = this.fb.group({
      clientName: ["", [Validators.required]],
      clientEmail: ["", [Validators.required, Validators.email]],
      clientAddress: ["", [Validators.required]],
      invoiceDate: ["", [Validators.required]],
      dueDate: ["", [Validators.required]],
      status: ["Unpaid", Validators.required],
      items: this.fb.array([]),
      taxRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      discount: [0, [Validators.required, Validators.min(0)]],
    })

    this.addItem()
  }

  get items(): FormArray {
    return this.invoiceForm.get("items") as FormArray
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      itemName: ["", Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    })
  }

  addItem(): void {
    this.items.push(this.createItemFormGroup())
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index)
    }
    else {
      this.error = 'Atleast 1 item is required.'
      setTimeout(() => {
        this.error = ''
      }, 3000);
    }
  }

  calculateTotals(): void {
    this.subtotal = this.items.controls.reduce((sum, item) => {
      const quantity = item.get("quantity")?.value || 0
      const price = item.get("price")?.value || 0
      return sum + quantity * price
    }, 0)

    const taxRate = this.invoiceForm.get("taxRate")?.value || 0
    this.taxAmount = this.subtotal * (taxRate / 100)
    const discount = this.invoiceForm.get("discount")?.value || 0
    this.discountAmount = (this.subtotal * (discount / 100))
    this.grandTotal = this.subtotal + this.taxAmount - this.discountAmount;
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      const step1Controls = ["clientName", "clientEmail", "clientAddress", "invoiceDate", "dueDate", "status"]
      if (this.validateStepFields(step1Controls)) {
        this.currentStep = 2
      }
    }
  }

  previousStep(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1
    }
  }

  validateStepFields(controlNames: string[]): boolean {
    let valid = true

    controlNames.forEach((controlName) => {
      const control = this.invoiceForm.get(controlName)
      if (control) {
        control.markAsTouched()
        if (control.invalid) {
          valid = false
        }
      }
    })

    return valid
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      this.invoiceService.createInvoice(this.invoiceForm.value).subscribe(res => {
        this.toastService.showAlert('success', 'Success', "New Invoice is create")

        this.invoiceForm.reset()
        this.currentStep = 1;
      }, error => {
        this.toastService.showAlert('error', 'Error', error.error.message)
      })
    }
    // else {
    //   this.markFormGroupTouched(this.invoiceForm)
    // }
  }
  loadSampleData(): void {
    const sampleData: Invoice = {
      clientName: "Bhavesh Chaudhari",
      clientEmail: "bhavesh@gmail.com",
      clientAddress: "402, Green Residency, Nagpur, Maharashtra",
      invoiceDate: "2025-04-07",
      dueDate: "2025-04-17",
      items: [
        {
          itemName: "Logo Design",
          quantity: 2,
          price: 2500,
        },
        {
          itemName: "Business Card Design",
          quantity: 3,
          price: 500,
        },
        {
          itemName: "Brochure Design",
          quantity: 1,
          price: 4000,
        },
      ],
      taxRate: 10,
      discount: 5,
      status: "Unpaid",
    }

    while (this.items.length) {
      this.items.removeAt(0)
    }

    sampleData.items.forEach((item) => {
      this.items.push(
        this.fb.group({
          itemName: [item.itemName, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          price: [item.price, [Validators.required, Validators.min(0)]],
        }),
      )
    })

    this.invoiceForm.patchValue({
      clientName: sampleData.clientName,
      clientEmail: sampleData.clientEmail,
      clientAddress: sampleData.clientAddress,
      invoiceDate: sampleData.invoiceDate,
      dueDate: sampleData.dueDate,
      taxRate: sampleData.taxRate,
      discount: sampleData.discount,
      status: sampleData.status,
    })
  }
}
