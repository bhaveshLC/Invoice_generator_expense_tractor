import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/Auth/login/login.component';
import { RegisterComponent } from './pages/Auth/register/register.component';
export const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "dashboard", component: DashboardComponent },
    // { path: "invoices", component: InvoicesComponent },
    // { path: "expenses", component: ExpensesComponent },
    // { path: "reports", component: ReportsComponent },
    { path: "**", redirectTo: "/login" },
];
