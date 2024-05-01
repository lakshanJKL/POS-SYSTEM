import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router, RouterLink} from "@angular/router";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {OrderService} from "../../../order.service";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";

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


  expandRw: boolean = false;
  rowNum: any;
  orderProducts: any[] = [];

  constructor(private dataBase: AngularFirestore,
              private snackBar: MatSnackBar,
              private router: Router,
              private orderService: OrderService
  ) {
  }

  ngOnInit(): void {
    this.router.navigateByUrl("/dashboard/orders/new");
    this.orderProducts = this.orderService.productCart;
  }


  onDelete(id: any) {
    if (confirm("Are you sure ?")) {
      if (id >= 0 && id < this.orderService.productCart.length) {
        this.orderService.productCart.splice(id, 1);
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
