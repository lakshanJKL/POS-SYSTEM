import {Component, OnInit} from '@angular/core';
import {map, Observable, startWith} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatExpansionModule, MatExpansionPanel, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatProgressBar} from "@angular/material/progress-bar";
import {AsyncPipe, CommonModule, NgIf} from "@angular/common";
import {MatProgressSpinner, MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatIcon} from "@angular/material/icon";
import {OrdersService} from "../../../service/orders.service";


@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatButton,
    MatInput,
    ReactiveFormsModule,
    MatProgressBar,
    AsyncPipe,
    NgIf,
    MatExpansionPanel,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatExpansionPanelTitle,
    RouterOutlet,
    MatProgressSpinner,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatIcon,
    RouterLink,
  ],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.scss'
})
export class NewOrderComponent implements OnInit {

  panelOpenState: boolean = false;
  customerOptions: string[] = [];
  productOptions: string[] = [];
  customerObject: any[] = [];
  productObject: any[] = [];
  addToCartObj: any = {};
  productDescription: any;
  selectedProductId: any;
  tottalAmount: any = 0;
  productCount: any = 0;
  customer: any = {};
  customerFilteredOptions: Observable<string[]> = new Observable<string[]>();
  productFilteredOptions: Observable<string[]> = new Observable<string[]>();
  customerName: any = new FormControl("", Validators.required);
  productName: any = new FormControl("", Validators.required);
  quantity: any = new FormControl("", Validators.required);
  address: any = new FormControl("");
  salary: any = new FormControl("");
  qtyOnHand: any = new FormControl("");
  unitPrice: any = new FormControl("");


  constructor(
    private snackBar: MatSnackBar,
    private db: AngularFirestore,
    private ordersService: OrdersService,
  ) {
  }

  ngOnInit() {
    this.db.collection("customers").get()
      .subscribe((querySnaps) => {
        querySnaps.forEach(doc => {
          let customers: any = doc.data();
          this.customerObject.push(customers);
          this.customerOptions.push(customers.fullName);
        });
      });

    this.db.collection("products").get()
      .subscribe((querySnaps) => {
        querySnaps.forEach(doc => {
          let products: any = doc.data();
          this.productObject.push(products);
          this.productOptions.push(products.description);
        });
      });

    this.customerFilteredOptions = this.customerName.valueChanges.pipe(
      startWith(''),
      map(value => this._customerFilter(value || '')),
    );
    this.productFilteredOptions = this.productName.valueChanges.pipe(
      startWith(''),
      map(value => this._productFilter(value || '')),
    );
  }

  private _customerFilter(value: any): string[] {
    const filterValue = value.toString().toLowerCase(); // Ensure value is treated as string

    return this.customerOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _productFilter(value: any): string[] {
    const filterValue = value.toString().toLowerCase(); // Ensure value is treated as string

    return this.productOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  autoCompleteFields(selectedOption: any) {
    this.db.collection("products", ref => ref
      .where("description", "==", selectedOption))
      .get().subscribe((querySnaps) => {
      querySnaps.forEach(doc =>
        this.selectedProductId = doc.id
      )
    });

    const selectedCustomer = this.customerObject.find(customer => customer.fullName === selectedOption);
    const selectedProduct = this.productObject.find(product => product.description === selectedOption);

    if (selectedCustomer) {
      this.address.setValue(selectedCustomer.address);
      this.address.disable();
      this.salary.setValue(selectedCustomer.salary);
      this.salary.disable();
    }
    if (selectedProduct) {
      this.productDescription = selectedProduct.description;
      this.qtyOnHand.setValue(selectedProduct.qtyOnHand);
      this.qtyOnHand.disable();
      this.unitPrice.setValue(selectedProduct.unitPrice);

      this.unitPrice.disable();
    }

  }

  addToCart() {
    if (!(this.customerName.value === null || this.productName.value === null)) {
      let qtyPurchase = Number(this.quantity.value);
      if (!isNaN(qtyPurchase) && qtyPurchase > 0) {

        let qty = Number(this.qtyOnHand.value);
        let updateQty = qty - qtyPurchase;

        if (qty >= qtyPurchase) {

          const prodRef = this.db.collection("products").doc(this.selectedProductId);
          prodRef.update({qtyOnHand: updateQty}).then(() => {
            this.addToCartObj = {
              productName: this.productDescription,
              productQty: qtyPurchase,
              productUnitPrice: this.unitPrice.value,
              productCost: qtyPurchase * this.unitPrice.value
            };

            // Reset form fields
            this.productName.reset();
            this.qtyOnHand.reset();
            this.unitPrice.reset();
            this.quantity.reset();

            this.ordersService.productCart.push(this.addToCartObj);
            this.tottalAmount += this.addToCartObj.productCost;
            this.productCount = this.ordersService.productCart.length;

          }).catch(() => {
            alert("Product quantity not updated! Please try again.");
          });
        } else {
          alert("Quantity exceeds available quantity on hand!");
        }
      } else {
        alert("Please enter a valid quantity greater than 0!");
      }
    } else {
      alert("Please select customer and product!");
    }
  }

  placeOrder() {
    if (!((Object.keys(this.customer).length === 0) || (this.ordersService.productCart.length == 0))) {
      //customer object
      this.customer = {
        fullName: this.customerName.value,
        address: this.address.value,
        salary: this.salary.value
      };

      //order object
      const order = {
        customer: this.customer,
        products: this.ordersService.productCart,
        date: new Date().toLocaleDateString('en-GB'),
        total_cost: this.tottalAmount
      };

      this.db.collection("orders").add(order).then(() => {
        this.snackBar.open("Success !", "close", {
          duration: 5000,
          horizontalPosition: "center",
          verticalPosition: "top",
          direction: "ltr"
        })
        window.location.reload();
      }).catch(() => {
        alert("Please Try Again !");
      });
    } else {
      return alert("Please Enter values !");
    }
  }
}
