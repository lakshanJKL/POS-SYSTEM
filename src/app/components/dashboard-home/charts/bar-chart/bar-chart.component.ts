import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {DashboardService} from "../../../service/dashboard.service";
import {Chart} from "chart.js";

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnInit {


//chart js
  @ViewChild('barChart') barChart: any;
  canvas: any;
  ctx: any;
  allProductNames: any[] = [];
  allProductQty: any[] = [];

  constructor(private database: AngularFirestore, private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.database.collection("products").get().subscribe((querySnaps) => {
      querySnaps.forEach(doc => {
        let data: any = doc.data();
        this.allProductNames.push(data.description);
        this.allProductQty.push(data.qtyOnHand);
      });
      this.createBarChart();
    });
  }

  private createBarChart() {
    const backgroundColors: string[] = [];
    const borderColors: string[] = [];
    for (let clr = 0; clr < this.allProductNames.length; clr++) {
      backgroundColors.push(this.dashboardService.colors(0.2));
      borderColors.push(this.dashboardService.colors(1));
    }
    this.canvas = this.barChart.nativeElement;
    this.ctx = this.canvas.getContext("2d");

    new Chart(this.ctx, {
      type: "bar",
      data: {
        labels: this.allProductNames,
        datasets: [{
          label: 'All Products',
          data: this.allProductQty,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      }
    });
  }
}
