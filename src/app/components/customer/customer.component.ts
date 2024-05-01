import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatTab, MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    RouterOutlet,
    MatTabGroup,
    MatTab,
    RouterLink
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {

}
