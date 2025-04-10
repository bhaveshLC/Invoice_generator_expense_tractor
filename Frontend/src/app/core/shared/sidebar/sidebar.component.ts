import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  showAccountMenu: boolean = false

  navItems: any[] = [
    { icon: "fa-solid fa-grip", label: "Dashboard", route: "/dashboard" },
    { icon: "fa-solid fa-file-lines", label: "Invoices", route: "/invoices" },
    { icon: "fa-solid fa-credit-card", label: "Expenses", route: "/expenses" },
    { icon: "fa-solid fa-chart-simple", label: "Reports", route: "/reports" },
    { icon: "fa-solid fa-download", label: "Export", route: "/export" },
  ]

  constructor(private router: Router) { }

  isActive(route: string): boolean {
    return this.router.url === route
  }

  navigate(route: string): void {
    this.router.navigate([route])
  }
  toggleAccountMenu(): void {
    this.showAccountMenu = !this.showAccountMenu;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.showAccountMenu = false;
  }
}
