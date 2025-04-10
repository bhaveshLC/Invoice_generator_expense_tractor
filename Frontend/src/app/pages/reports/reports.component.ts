import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { ExpenseService } from '../../core/service/expense/expense.service';
import { InvoiceService } from '../../core/service/invoice/invoice.service';

@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  expenses: any[] = []
  invoices: any[] = []

  constructor(
    private expenseService: ExpenseService,
    private invoiceService: InvoiceService,
  ) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData(): void {
    this.expenseService.getAllExpenses().subscribe((res: any) => {
      this.expenses = res.data.expenses

      this.invoiceService.getInvoices().subscribe((res: any) => {
        this.invoices = res.data.invoices
        this.renderCharts()
      })
    })
  }

  renderCharts(): void {
    this.renderMonthlyChart()
    this.renderCategoryChart()
  }

  renderMonthlyChart(): void {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const expensesByMonth = Array(12).fill(0)
    this.expenses.forEach((expense) => {
      const month = new Date(expense.date).getMonth()
      expensesByMonth[month] += expense.amount
    })

    const incomeByMonth = Array(12).fill(0)
    this.invoices.forEach((invoice) => {
      const month = new Date(invoice.date).getMonth()
      incomeByMonth[month] += invoice.amount
    })

    const ctx = document.getElementById("monthlyChart") as HTMLCanvasElement
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Income",
            data: incomeByMonth,
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 1,
          },
          {
            label: "Expenses",
            data: expensesByMonth,
            backgroundColor: "rgba(239, 68, 68, 0.5)",
            borderColor: "rgb(239, 68, 68)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }

  renderCategoryChart(): void {
    const categories: { [key: string]: number } = {}
    this.expenses.forEach((expense) => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0
      }
      categories[expense.category] += expense.amount
    })

    const categoryLabels = Object.keys(categories)
    const categoryData = Object.values(categories)

    const ctx = document.getElementById("categoryChart") as HTMLCanvasElement
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: categoryLabels,
        datasets: [
          {
            data: categoryData,
            backgroundColor: [
              "rgba(59, 130, 246, 0.5)",
              "rgba(16, 185, 129, 0.5)",
              "rgba(245, 158, 11, 0.5)",
              "rgba(239, 68, 68, 0.5)",
              "rgba(139, 92, 246, 0.5)",
            ],
            borderColor: [
              "rgb(59, 130, 246)",
              "rgb(16, 185, 129)",
              "rgb(245, 158, 11)",
              "rgb(239, 68, 68)",
              "rgb(139, 92, 246)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    })
  }
}
