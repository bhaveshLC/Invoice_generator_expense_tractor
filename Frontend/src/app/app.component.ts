import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from "./core/shared/toast/toast.component";

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
  constructor(private router: Router) { }

  isAuthRoute(): boolean {
    return this.router.url === "/login" || this.router.url === "/register"
  }
}
