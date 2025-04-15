import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/Auth/auth.service';
import { ExportService } from '../../service/Export/export.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  showAccountMenu: boolean = false
  showExportMenu: boolean = false
  authService = inject(AuthService)
  exportService = inject(ExportService)
  navItems: any[] = [
    { icon: "fa-solid fa-grip", label: "Dashboard", route: "/dashboard" },
    { icon: "fa-solid fa-file-lines", label: "Invoices", route: "/invoices" },
    { icon: "fa-solid fa-money-check-dollar", label: "Budget", route: "/budgets" },
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
  toggleExportMenu() {
    this.showExportMenu = !this.showExportMenu
  }
  sidebarOpen: boolean = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  logout(): void {
    this.authService.logout()
  }
  onNavItemClick(item: any, event: MouseEvent): void {
    if (item.label === 'Export') {
      event.stopPropagation();
      this.toggleExportMenu();
    } else {
      this.navigate(item.route);
    }
  }
  onExportExpenseToExcel() {
    this.exportService.exportExpenseToExcel().subscribe((excelBlob: any) => {
      const blobUrl = URL.createObjectURL(excelBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `expense.xlsx`;
      link.click();
      URL.revokeObjectURL(blobUrl);
    })
  }
  onExportInvoiceToExcel() {
    this.exportService.exportInvoiceToExcel().subscribe(
      (excelBlob: any) => {
        const blobUrl = URL.createObjectURL(excelBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `invoice.xlsx`;
        link.click();
        URL.revokeObjectURL(blobUrl);
      }
    )
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.showExportMenu) {
      this.showExportMenu = false;
    }
  }
}
