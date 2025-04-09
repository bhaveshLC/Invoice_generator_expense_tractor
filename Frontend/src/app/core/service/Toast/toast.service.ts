import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id?: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  notifications$ = this.toasts.asObservable();
  private currentId = 0;

  show(toast: Toast) {
    const id = this.currentId++;
    const duration = toast.duration || 5000;
    const newToast = { ...toast, id };

    this.toasts.next([...this.toasts.value, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  remove(id: number) {
    this.toasts.next(
      this.toasts.value.filter(toast => toast.id !== id)
    );
  }

  clearAll() {
    this.toasts.next([]);
  }
}