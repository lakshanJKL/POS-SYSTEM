import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner, MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {finalize, Observable} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-update-product',
  standalone: true,
    imports: [
        AsyncPipe,
        FormsModule,
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        MatProgressBar,
        NgIf,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatProgressSpinner,
        MatIcon
    ],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent implements OnInit {
    productId: any;
    loading: any = false;
    selectedProductImage: any;
    // @ts-ignore
    uploadRate: Observable<number | undefined>;
    // @ts-ignore
    downloadLink: Observable<string | undefined>;

    constructor(private storage: AngularFireStorage,
                private snackBar: MatSnackBar,
                private activeRoute: ActivatedRoute,
                private db: AngularFirestore,
                private router: Router
    ) {
        this.activeRoute.paramMap.subscribe(res => {
            this.productId = res.get('id');
        })
    }

    form = new FormGroup({
        description: new FormControl('', [Validators.required]),
        qtyOnHand: new FormControl('', [Validators.required]),
        unitPrice: new FormControl('', [Validators.required]),
        productImage: new FormControl('', [Validators.required])
    })


    updateProduct() {

        const path =  'product/images/ ' + this.form.value.description + '/' + this.selectedProductImage.name;
        const fileRef = this.storage.ref(path);
        const task = this.storage.upload(path, this.selectedProductImage);

        this.uploadRate = task.percentageChanges();

        task.snapshotChanges().pipe(
            finalize(() => {
                this.downloadLink = fileRef.getDownloadURL();
            })
        ).subscribe();
        this.loading = true;

        task.then(() => {
            this.downloadLink.subscribe(res => {
                let customers = {
                    description: this.form.value.description,
                    qtyOnHand: this.form.value.qtyOnHand,
                    unitPrice: this.form.value.unitPrice,
                    productImage: res
                }
                //=======update=========
                const cusRef = this.db.collection('products').doc(this.productId);
                cusRef.update(customers)
                    .then((docRef) => {

                        this.loading = false;
                        this.router.navigateByUrl("/dashboard/products").then(()=>{

                            this.snackBar.open('product Updated !', 'Close', {
                                duration: 4000,
                                verticalPosition: 'top',
                                horizontalPosition: "center",
                                direction: 'ltr'
                            });
                            window.location.reload();
                        });
                    }).catch(() => {
                    alert("Please Try Again !");
                    this.loading = false;
                })
                //================
            })
        }).catch(err => {
            alert("Something wrong");
            this.loading = false;
        })
    }

    onChangeFile(event: any) {
        this.selectedProductImage = event.target.files[0];
    }

    ngOnInit(): void {
        let cusRef = this.db.collection("products").doc(this.productId);
        cusRef.get().subscribe((doc) => {
            if (doc.exists) {
                let data: any = doc.data();
                this.form.setValue({
                    description: data.description,
                    qtyOnHand: data.qtyOnHand,
                    unitPrice: data.unitPrice,
                    productImage: null
                });
            }
        });
    }
}
