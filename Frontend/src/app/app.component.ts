import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from "./core/shared/toast/toast.component";
import { Store } from '@ngrx/store';
import { decrement, increment, reset } from './action';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
  count = 0;
  constructor(private router: Router,
    private store: Store<{ count: number }>) {
    this.store.select('count').subscribe(count => {
      this.count = count;
    })
  }
  // isAuthRoute(): boolean {
  //   return this.router.url === "/login" || this.router.url === "/register"
  // }
  increment() {
    this.store.dispatch(increment())
  }
  decrement() {
    this.store.dispatch(decrement())
  }
  reset() {
    this.store.dispatch(reset())
  }
}
