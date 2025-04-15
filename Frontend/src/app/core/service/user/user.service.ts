import { inject, Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, Observable, of } from "rxjs"
import { tap, catchError } from "rxjs/operators"
import { AuthService } from "../Auth/auth.service"
import { HttpService } from "../http/http.service"
@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor() { }
  httpService = inject(HttpService)
  getSelf() {
    return this.httpService.get('users/self')
  }
  updateUser(updatedUser: any) {
    return this.httpService.put('users/self', updatedUser)
  }
}
