import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/Auth/login/login.component';
import { RegisterComponent } from './pages/Auth/register/register.component';
import { InvoiceListComponent } from './pages/invoice-list/invoice-list.component';
import { ExpenseComponent } from './pages/expense/expense.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { AddInvoiceComponent } from './pages/components/add-invoice/add-invoice.component';
import { InvoiceDetailsComponent } from './pages/invoice-details/invoice-details.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { BudgetListComponent } from './pages/budget-list/budget-list.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'invoices', component: InvoiceListComponent },
            { path: 'invoices/:id', component: InvoiceDetailsComponent },
            { path: 'expenses', component: ExpenseComponent },
            { path: 'budgets', component: BudgetListComponent },
            { path: 'reports', component: ReportsComponent },
            { path: 'create-invoice', component: AddInvoiceComponent },
            { path: 'profile', component: ProfileComponent }
        ]
    },

    { path: '**', redirectTo: '/login' },
];