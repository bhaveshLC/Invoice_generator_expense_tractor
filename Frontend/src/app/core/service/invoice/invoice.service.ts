import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor() { }
  httpService = inject(HttpService)
  getInvoices(currentPage?: number) {
    let paramSet = new HttpParams();
    if (currentPage) {
      paramSet = paramSet.set('page', currentPage);
    }
    return this.httpService.get('invoices', paramSet)
  }
  getInvoice(id: string) {
    return this.httpService.get('invoices/' + id)
  }
  createInvoice(body: any) {
    return this.httpService.post('invoices', body)
  }
  updateInvoice(id: string, body: any) {
    return this.httpService.put('invoices/' + id, body)
  }
  deleteInvoice(id: string) {
    return this.httpService.delete('invoices/' + id)
  }
  getInvoicePDF(id: string) {
    return this.httpService.getWithOptional(`invoices/pdf/${id}`, {
      responseType: 'blob' as 'json'
    });
  }
  markInvoiceAsPaid(id: string) {
    return this.httpService.put(`invoices/paid/${id}`, {});
  }
  sendInvoicePDFMail(id: string) {
    return this.httpService.get(`invoices/send-mail/${id}`, {});
  }
}
