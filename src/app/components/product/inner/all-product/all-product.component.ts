import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatFabButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DashboardService} from "../../../service/dashboard.service";

@Component({
  selector: 'app-all-product',
  standalone: true,
  imports: [
    NgForOf,
    CurrencyPipe,
    MatIcon,
    MatFabButton,
    MatMiniFabButton,
    MatIconButton,
    RouterLink,
    RouterOutlet,
    NgIf,
    NgClass
  ],
  templateUrl: './all-product.component.html',
  styleUrl: './all-product.component.scss'
})
export class AllProductComponent implements OnInit {

  products: any[] = [];
  expandRw: boolean = false;
  rowNum: any = 0;

  constructor(private db: AngularFirestore,
              private storage: AngularFireStorage,
              private router: Router,
              private snackBar: MatSnackBar,
              private dashboardService: DashboardService
  ) {
  }

  ngOnInit(): void {
    this.db.collection('products').get().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.products.push({id: doc.id, data: doc.data()});
      })
    });
  }

  deleteCustomer(id: any, avatar: any) {
    if (confirm('Are you sure ?')) {
      this.db.collection('products').doc(id).delete().then(() => {
        this.storage.storage.refFromURL(avatar).delete().then(() => {
          this.snackBar.open('product Deleted !', 'Close', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'ltr'
          });

          window.location.reload();

        }).catch(() => {
          alert('Error deleting avatar:');
        });
      }).catch(() => {
        alert('Error deleting product:');
      });
    }
  }

  expandRow(num: number) {
    this.expandRw = !this.expandRw;
    this.rowNum = this.expandRw ? num : null;
  }

}
