import { Component, inject } from '@angular/core';
import { InvoiceService } from '../../core/service/invoice/invoice.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from "../../core/shared/confirmation-dialog/confirmation-dialog.component";
import { Router, RouterLink } from '@angular/router';
import { PaginationComponent } from "../../core/shared/pagination/pagination.component";
import { LoaderComponent } from "../../core/shared/loader/loader.component";

@Component({
  selector: 'app-invoice-list',
  imports: [CommonModule, DatePipe, RouterLink, ConfirmationDialogComponent, PaginationComponent, LoaderComponent],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css'
})
export class InvoiceListComponent {
  invoices: any[] = [];
  showAddInvoiceModal = false;
  showEditInvoiceModal = false;
  showDeleteConfirmation = false
  isLoading: boolean = false
  currentInvoice: any;
  router = inject(Router)
  currentPage = 1;
  pages: number[] = []
  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.isLoading = true
    this.invoiceService.getInvoices(this.currentPage)
      .subscribe(
        (res: any) => {
          this.invoices = res.data.invoices;
          this.currentPage = res.data.page
          this.pages = Array.from({ length: res.data.totalPages }, (_, i) => i + 1)
        },
        error => {
          console.error('Error loading invoices', error);
        },
        () => {
          this.isLoading = false
        }
      );
  }

  openAddInvoiceModal(): void {
  }

  closeAddInvoiceModal(): void {
    this.showAddInvoiceModal = false;
    this.showEditInvoiceModal = false
  }
  saveInvoice(invoice: any): void {
    this.invoiceService.createInvoice(invoice)
      .subscribe(
        (newInvoice: any) => {
          this.invoices.push(newInvoice);
          this.closeAddInvoiceModal();
        },
        error => {
          console.error('Error creating invoice', error);
        }
      );
  }
  onpageChange(e: any) {
    this.currentPage = e
    this.loadInvoices()
  }
  payInvoice(invoice: any): void {
    this.invoiceService.updateInvoice(invoice.id, { status: "Paid" }).subscribe(
      (updatedInvoice: any) => {
        const index = this.invoices.findIndex((i) => i.id === updatedInvoice.id)
        if (index !== -1) {
          this.invoices[index] = updatedInvoice
        }
      },
      (error) => {
        console.error("Error paying invoice", error)
      },
    )
  }
  onView(id: string) {
    this.router.navigateByUrl(`/invoices/${id}`)
  }
  onEditInvoice(invoice: any) {
    this.currentInvoice = invoice;
    this.showEditInvoiceModal = true
  }
  confirmDeleteInvoice(invoice: any): void {
    this.currentInvoice = invoice
    this.showDeleteConfirmation = true
  }

  deleteInvoice(): void {
    if (this.currentInvoice) {
      this.invoiceService.deleteInvoice(this.currentInvoice._id).subscribe(
        () => {
          this.loadInvoices()
          this.cancelDeleteInvoice()
        },
        (error) => {
          console.error("Error deleting invoice", error)
        },
      )
    }
  }

  cancelDeleteInvoice(): void {
    this.showDeleteConfirmation = false
    this.currentInvoice = null
  }
}
