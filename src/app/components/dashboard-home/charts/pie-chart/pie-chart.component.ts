import {AfterViewInit, Component, OnInit, ViewChild, viewChild} from '@angular/core';
import {Chart} from 'chart.js';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {DashboardService} from "../../../service/dashboard.service";

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnInit {
  canvas: any;
  ctx: any;
  allcustomers: any[] = [];
  allproducts: any[] = [];
  allOrders: any[] = [];
  @ViewChild("pieChart") myPieChart: any;

  constructor(private database: AngularFirestore,
              private dashboardService: DashboardService,
  ) {
  }

  ngOnInit(): void {
    this.database.collection("customers").get()
      .subscribe((querySnaps) => {
        querySnaps.forEach(doc => {
          this.allcustomers.push(doc.data());
        });
        this.createPieChart();
      });
    this.database.collection("products").get()
      .subscribe((querySnaps) => {
        querySnaps.forEach(doc => {
          this.allproducts.push(doc.data());
        });
        this.createPieChart();
      });
    this.database.collection("orders").get()
      .subscribe((querySnaps) => {
        querySnaps.forEach(doc => {
          this.allOrders.push(doc.data());
        });
        this.createPieChart();
      });
  }

  createPieChart() {
    if (this.allcustomers.length > 0 && this.allproducts.length > 0 && this.allOrders.length > 0) {
      this.canvas = this.myPieChart.nativeElement;
      this.ctx = this.canvas.getContext("2d");
      let allCustomers = this.allcustomers.length;
      let allProducts = this.allproducts.length;
      let allOrder = this.allOrders.length;

      new Chart(this.ctx, {
        type: "doughnut",
        data: {
          labels: [
            'Customers',
            'Products',
            'Orders'
          ],
          datasets: [{
            label: 'All Data',
            data: [allCustomers, allProducts, allOrder],
            backgroundColor: [
              this.dashboardService.colors(1),
              this.dashboardService.colors(1),
              this.dashboardService.colors(1),
            ],

          }]
        }
      });
    }
  }
}
