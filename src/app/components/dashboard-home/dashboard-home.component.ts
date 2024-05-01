import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {PieChartComponent} from "./charts/pie-chart/pie-chart.component";
import {LineChartComponent} from "./charts/line-chart/line-chart.component";
import {BarChartComponent} from "./charts/bar-chart/bar-chart.component";

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    RouterLink,
    MatButton,
    PieChartComponent,
    LineChartComponent,
    BarChartComponent
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent {

}
