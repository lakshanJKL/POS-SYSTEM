import {Component, OnInit, ViewChild, viewChild} from '@angular/core';
import {Chart} from 'chart.js';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {DashboardService} from "../../../service/dashboard.service";


@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent implements OnInit {
  canvas: any;
  ctx: any;
  @ViewChild("lineChart") myLineChart: any;
  allCustomersName: any[] = [];

  constructor(private database: AngularFirestore,
              private dashboardService: DashboardService,
  ) {
  }

  ngOnInit(): void {
    this.database.collection("customers").get()
      .subscribe((querySnaps) => {
        querySnaps.forEach(doc => {
          let data: any = doc.data();
          this.allCustomersName.push(data.fullName);
        });
        this.createLineChart();
      });

  }

  private createLineChart() {


    this.canvas = this.myLineChart.nativeElement;
    this.ctx = this.canvas.getContext("2d");

    new Chart(this.ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: 'All Customers',
          data: [this.allCustomersName.length],
          fill: false,
          borderColor: this.dashboardService.colors(1),
        }]
      }
    });
  }
}
