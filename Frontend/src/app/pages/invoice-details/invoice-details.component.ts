import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../core/service/invoice/invoice.service';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from "../../core/shared/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-invoice-details',
  imports: [CommonModule, ConfirmationDialogComponent],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css'
})
export class InvoiceDetailsComponent implements OnInit {
  invoice: any
  loading = false
  error = ""
  showDeleteConfirmation = false
  showPaymentConfirmation = false
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    this.loading = true
    const id = this.route.snapshot.paramMap.get("id")

    if (id) {
      this.invoiceService.getInvoice(id).subscribe(
        (res: any) => {
          this.invoice = res.data.invoice
          this.loading = false
        },
        (error) => {
          this.error = "Failed to load invoice details"
          this.loading = false
          console.error("Error loading invoice", error)
        }
      )
    } else {
      this.error = "Invoice ID not found"
      this.loading = false
    }
  }

  calculateSubtotal(): number {
    if (!this.invoice?.items) return 0

    return this.invoice.items.reduce((total: any, item: any) => {
      return total + (item.quantity * item.price)
    }, 0)
  }

  calculateTaxAmount(): number {
    const subtotal = this.calculateSubtotal()
    return subtotal * (this.invoice?.taxRate || 0) / 100
  }

  calculateTotal(): number {
    const subtotal = this.calculateSubtotal()
    const taxAmount = this.calculateTaxAmount()
    return subtotal + taxAmount - (this.invoice?.discount || 0)
  }

  goBack(): void {
    this.router.navigate(["/invoices"])
  }

  printInvoice() {
    this.invoiceService.getInvoicePDF(this.invoice._id).subscribe(
      (pdfBlob: any) => {
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `invoice-${this.invoice._id}.pdf`;
        link.click();
        URL.revokeObjectURL(blobUrl);
        alert('PDF downloaded');
      },
      (error) => {
        console.error('PDF download failed:', error);
      }
    );
  }
  completePayment() {
    this.invoiceService.markInvoiceAsPaid(this.invoice._id).subscribe((res: any) => {
      this.invoice = res.data.invoice;
      this.showPaymentConfirmation = false;
    }, error => {
      this.showPaymentConfirmation = false;
      console.log(error.error.message)
    })
  }
  cancelPayment() {
    this.showPaymentConfirmation = false
  }
  markAsPaid() {
    this.showPaymentConfirmation = true
  }
}

