import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }
  httpService = inject(HttpService);
  exportExpenseToExcel() {
    return this.httpService.getWithOptional('export/expense', {
      responseType: 'blob' as 'json'
    })
  }
  exportInvoiceToExcel() {
    return this.httpService.getWithOptional('export/invoice', {
      responseType: 'blob' as 'json'
    })
  }
}
