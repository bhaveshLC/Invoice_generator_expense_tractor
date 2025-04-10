import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor() { }
  httpService = inject(HttpService)
  getInvoices() {
    return this.httpService.get('invoices')
  }
  getInvoice(id: number) {
    return this.httpService.get('invoices/' + id)
  }
  createInvoice(body: any) {
    return this.httpService.post('invoices', body)
  }
  updateInvoice(id: number, body: any) {
    return this.httpService.put('invoices/' + id, body)
  }
  deleteInvoice(id: number) {
    return this.httpService.delete('invoices/' + id)
  }
}
