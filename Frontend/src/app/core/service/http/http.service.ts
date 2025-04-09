import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../../../Evironment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }
  http = inject(HttpClient)
  get(endPoint: string) {
    return this.http.get(apiUrl + endPoint)
  }
  post(endPoint: string, body: any) {
    return this.http.post(apiUrl + endPoint, body)
  }
  put(endPoint: string, body: any) {
    return this.http.put(apiUrl + endPoint, body)
  }
  patch(endPoint: string, body: any) {
    return this.http.patch(apiUrl + endPoint, body)
  }
  delete(endPoint: string) {
    return this.http.delete(apiUrl + endPoint)
  }
}
