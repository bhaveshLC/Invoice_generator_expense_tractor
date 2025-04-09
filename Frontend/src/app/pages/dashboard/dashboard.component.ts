import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from "../../core/shared/sidebar/sidebar.component";
import { ChartComponent } from "../../core/shared/chart/chart.component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CurrencyPipe, SidebarComponent, ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  invoiceCount = 12
  invoiceTotal = 18
  expenseTotal = 18200

  expenseChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    datasets: [
      {
        data: [8, 9, 7, 8, 9, 8, 9, 8, 9, 10],
        backgroundColor: "#4f86f7",
      },
    ],
  }

  monthlySummaryData = {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        data: [5, 7, 5, 6, 7, 8, 9],
        backgroundColor: "#4f86f7",
      },
    ],
  }

  constructor() { }

  ngOnInit(): void { }
}
