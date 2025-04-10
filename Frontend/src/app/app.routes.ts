import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/Auth/login/login.component';
import { RegisterComponent } from './pages/Auth/register/register.component';
import { InvoiceListComponent } from './pages/invoice-list/invoice-list.component';
import { ExpenseComponent } from './pages/expense/expense.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { AddInvoiceComponent } from './pages/components/add-invoice/add-invoice.component';
export const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "dashboard", component: DashboardComponent },
    { path: "invoices", component: InvoiceListComponent },
    { path: "expenses", component: ExpenseComponent },
    { path: "reports", component: ReportsComponent },
    { path: 'create-invoice', component: AddInvoiceComponent },
    { path: "**", redirectTo: "/login" },
];
