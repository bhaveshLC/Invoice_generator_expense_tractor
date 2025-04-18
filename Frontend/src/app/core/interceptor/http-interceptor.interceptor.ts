import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../service/Auth/auth.service';
import { ToastService } from '../service/Toast/toast.service';

export const httpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  const authService = inject(AuthService)
  const toastService = inject(ToastService)
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        authService.logout();
        toastService.showAlert('error', 'Token expired', 'please login again')
      }
      return throwError(() => error);
    })
  );
};