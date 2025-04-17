import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvoiceFormComponent } from "../invoice-form/invoice-form.component";
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../core/service/invoice/invoice.service';
import { ToastService } from '../../../core/service/Toast/toast.service';

@Component({
  selector: 'app-edit-invoice',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, InvoiceFormComponent],
  templateUrl: './edit-invoice.component.html',
  styleUrl: './edit-invoice.component.css'
})
export class EditInvoiceComponent {
  invoice: any
  loading = true
  error = ""

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadInvoice()
  }

  loadInvoice(): void {
    const id = this.route.snapshot.paramMap.get("id")
    if (!id) {
      this.error = "Invoice ID not found"
      this.loading = false
      return
    }

    this.invoiceService.getInvoice(id).subscribe(
      (res: any) => {
        this.invoice = res.data.invoice
        this.loading = false
      },
      (error: any) => {
        this.error = "Failed to load invoice. Please try again."
        this.loading = false
        console.error("Error loading invoice", error)
      },
    )
  }

  saveInvoice(updatedInvoice: any): void {
    if (!this.invoice) return

    this.loading = true
    console.log(updatedInvoice)
    this.invoiceService.updateInvoice(this.invoice._id, updatedInvoice).subscribe(
      (result: any) => {
        this.invoice = result.data.invoice
        this.loading = false
        this.router.navigate(["/invoices"])
        this.toastService.showAlert('success', 'success', 'Invoice updated')
      },
      (error: any) => {
        this.loading = false
        this.error = "Failed to update invoice. Please try again."
        console.error("Error updating invoice", error)
        this.toastService.showAlert('error', 'Error', error.error.message)
      },
    )
  }

  goBack(): void {
    this.router.navigate(["/invoices"])
  }
}
