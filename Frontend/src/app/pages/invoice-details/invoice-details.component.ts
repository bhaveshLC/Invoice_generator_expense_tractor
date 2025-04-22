import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../core/service/invoice/invoice.service';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from "../../core/shared/confirmation-dialog/confirmation-dialog.component";
import { ToastService } from '../../core/service/Toast/toast.service';
import { UserService } from '../../core/service/user/user.service';
import { LoaderComponent } from "../../core/shared/loader/loader.component";

@Component({
  selector: 'app-invoice-details',
  imports: [CommonModule, ConfirmationDialogComponent, LoaderComponent],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css'
})
export class InvoiceDetailsComponent implements OnInit {
  invoice: any
  user: any
  loading = false
  isLoading: boolean = false
  isDataLoading: boolean = false
  pdfLoading = false
  error = ""
  showDeleteConfirmation = false
  showPaymentConfirmation = false
  showEmailConfirmation = false
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private userService: UserService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.isDataLoading = true
    const id = this.route.snapshot.paramMap.get("id")
    this.userService.getSelf().subscribe((res: any) => {
      this.user = res.data.user
    })
    if (id) {
      this.invoiceService.getInvoice(id).subscribe(
        (res: any) => {
          this.invoice = res.data.invoice
        },
        (error) => {
          this.error = "Failed to load invoice details"
          console.error("Error loading invoice", error)
        }, () => {
          this.isDataLoading = false
        }
      )
    } else {
      this.error = "Invoice ID not found"
      this.isDataLoading = false
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
    this.pdfLoading = true
    this.invoiceService.getInvoicePDF(this.invoice._id).subscribe(
      (pdfBlob: any) => {
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `invoice-${this.invoice._id}.pdf`;
        link.click();
        URL.revokeObjectURL(blobUrl);
        this.toastService.showAlert('success', "Success", 'Invoice PDF downloaded')
      },
      (error) => {
        console.error('PDF download failed:', error);
      }, () => {
        this.pdfLoading = false
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
  confirmSendEmail() {
    this.showEmailConfirmation = true
  }
  cancelEmailProcess() {
    this.showEmailConfirmation = false
  }
  sendMail() {
    this.isLoading = true
    this.showEmailConfirmation = false
    this.invoiceService.sendInvoicePDFMail(this.invoice._id).subscribe(res => {
      this.toastService.showAlert('success', 'PDF Sent on Email', "Check your mail box.")
    }, error => {
      this.toastService.showAlert('error', 'Error', error.error.messge)
    }, () => {
      this.isLoading = false
    })
  }
}

