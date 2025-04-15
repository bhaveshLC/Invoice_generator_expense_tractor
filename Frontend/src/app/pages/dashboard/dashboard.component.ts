import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ChartComponent } from "../../core/shared/chart/chart.component";
import { DashboardService } from '../../core/service/Dashboard/dashboard.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ChartComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  invoiceCount = 0;
  invoiceTotal = 0;
  expenseTotal = 0;
  paidAmount = 0;
  unpaidAmount = 0;

  recentInvoices: any[] = [];
  recentExpenses: any[] = [];

  expenseChartData: any

  monthlySummaryData = {
    labels: [],
    datasets: [{ data: [], backgroundColor: "#4f86f7" }]
  };
  isDataLoaded = signal<boolean>(false)
  dashboardService = inject(DashboardService)
  constructor() { }

  ngOnInit(): void {
    this.isDataLoaded.set(false)
    this.loadData()
  }
  loadData() {

    const backgroundColors = [
      "#4f86f7", // Food
      "#34c38f", // Transport
      "#f1b44c", // Utilities
      "#f46a6a", // Entertainment
      "#6f42c1", // Shopping
      "#343a40"  // Other
    ];

    const borderColors = [
      "#3e6ed5",
      "#2fa37a",
      "#dca633",
      "#d84a4a",
      "#59359c",
      "#222629"
    ];
    this.dashboardService.getDashboard().subscribe((res: any) => {
      const data = res.dashboardData.data
      this.invoiceCount = data.invoiceCount;
      this.invoiceTotal = data.invoiceTotal;
      this.expenseTotal = data.expenseTotal;
      this.paidAmount = data.paidAmount;
      this.unpaidAmount = data.unpaidAmount;
      this.recentInvoices = data.recentInvoices;
      this.recentExpenses = data.recentExpenses;
      this.expenseChartData = {
        labels: data.expenseChartData.labels || [],
        datasets: [
          {
            data: data.expenseChartData.data || [],
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      };
      console.log(this.expenseChartData)
      this.monthlySummaryData = {
        labels: data.monthlySummaryData.labels || [],
        datasets: [{
          data: data.monthlySummaryData.datasets || [],
          backgroundColor: "#4f86f7"
        }]
      };
      this.isDataLoaded.set(true)
    });
  }
}
