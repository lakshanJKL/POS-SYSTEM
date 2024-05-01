import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router, RouterLink} from "@angular/router";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {OrdersService} from "../../../service/orders.service";

@Component({
  selector: 'app-all-order',
  standalone: true,
  imports: [
    MatIcon,
    CurrencyPipe,
    MatIconButton,
    MatTooltip,
    RouterLink,
    NgForOf
  ],
  templateUrl: './all-order.component.html',
  styleUrl: './all-order.component.scss'
})
export class AllOrderComponent implements OnInit {

  orderProducts: any[] = [];

  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private ordersService: OrdersService
  ) {
  }

  ngOnInit(): void {
    this.router.navigateByUrl("/dashboard/orders/new");
    this.orderProducts = this.ordersService.productCart;
  }


  onDelete(id: any) {
    if (confirm("Are you sure ?")) {
      if (id >= 0 && id < this.ordersService.productCart.length) {
        this.ordersService.productCart.splice(id, 1);
      }
      this.snackBar.open("Successfully Deleted !", "close", {
        duration: 2000,
        verticalPosition: "top",
        horizontalPosition: "center",
        direction: "ltr"
      });
    }
  }
}
