import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() data: any
  @Input() type: keyof ChartTypeRegistry = "bar"
  @ViewChild("chartCanvas") chartCanvas!: ElementRef

  private chart: any

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.createChart()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart) {
      this.chart.destroy()
      this.createChart()
    }
  }

  private createChart(): void {
    if (!this.chartCanvas) return

    const ctx = this.chartCanvas.nativeElement.getContext("2d")
    console.log(this.data)
    this.chart = new Chart(ctx, {
      type: this.type,
      data: {
        labels: this.data.labels,
        datasets: this.data.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }
}
