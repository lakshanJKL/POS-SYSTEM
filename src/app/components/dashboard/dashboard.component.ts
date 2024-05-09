import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {MatButton, MatButtonModule, MatFabButton, MatIconButton} from "@angular/material/button";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatTooltip, MatTooltipModule} from "@angular/material/tooltip";
import {NgIf} from "@angular/common";
import {DashboardService} from "../service/dashboard.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButton,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatIcon,
    MatFabButton,
    MatTooltipModule,
    MatTooltip,
    MatIconButton,
    MatIconModule,
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isState: any = true;
  tooltipContent: any;

  constructor(private router: Router,
              private dashboardService: DashboardService
  ) {
    this.tooltipContent ="User : user@gmail.com";
  }

  loadState() {
    this.isState = false;
  }

  loadHome() {
    this.isState = true;
    this.router.navigateByUrl("/dashboard").then(() => {
      this.router.navigateByUrl("/dashboard/home")
    });
  }

  ngOnInit(): void {

  }
}
