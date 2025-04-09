import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor() { }
  httpService = inject(HttpService)
  getInvoices() {
    return this.httpService.get('invoice')
  }
  getInvoice(id: number) {
    return this.httpService.get('invoice/' + id)
  }
  createInvoice(body: any) {
    return this.httpService.post('invoice', body)
  }
  updateInvoice(id: number, body: any) {
    return this.httpService.put('invoice/' + id, body)
  }
  deleteInvoice(id: number) {
    return this.httpService.delete('invoice/' + id)
  }
}
