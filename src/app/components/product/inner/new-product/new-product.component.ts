import {Component} from '@angular/core';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {RouterLink, RouterOutlet} from "@angular/router";
import {
    MatExpansionModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner, MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {finalize, Observable} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
    selector: 'app-new-product',
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
        MatProgressSpinner
    ],
    templateUrl: './new-product.component.html',
    styleUrl: './new-product.component.scss'
})
export class NewProductComponent {
    panelOpenState: boolean = false;
    loading: boolean = false;
    selectedProductImage: any;
    // @ts-ignore
    uploadRate: Observable<number | undefined>;
    // @ts-ignore
    downloadLink: Observable<string | undefined>;


    constructor(
        private storage: AngularFireStorage,
        private snackBar: MatSnackBar,
        private db: AngularFirestore
    ) {
    }

    form = new FormGroup({
        description: new FormControl('', [Validators.required]),
        qtyOnHand: new FormControl('', [Validators.required]),
        unitPrice: new FormControl('', [Validators.required]),
        productImage: new FormControl('', [Validators.required])
    })


    saveProduct() {
        this.loading = true;
        const path = 'product/images/ ' + this.form.value.description + '/' + this.selectedProductImage.name;
        const fileRef = this.storage.ref(path);
        const task = this.storage.upload(path, this.selectedProductImage);

        this.uploadRate = task.percentageChanges();

        task.snapshotChanges().pipe(
            finalize(() => {
                this.downloadLink = fileRef.getDownloadURL();
            })
        ).subscribe();

        task.then(() => {

            this.downloadLink.subscribe(res => {
                let product = {
                    description: this.form.value.description,
                    qtyOnHand: this.form.value.qtyOnHand,
                    unitPrice: this.form.value.unitPrice,
                    productImage: res
                }
                //=======Save product=========
                this.db.collection('products').add(product)
                    .then((docRef) => {
                        this.snackBar.open('product Saved!', 'Close', {
                            duration: 5000,
                            verticalPosition: 'top',
                            horizontalPosition: "center",
                            direction: 'ltr'
                        });
                        this.loading = false;
                        window.location.reload();
                    }).catch(error => {
                    alert("Not Saved ! Try Again");
                })

            })
        }).catch(err => {
            alert("Something wrong");
            this.loading = false;
        })
    }

    onChangeFile(event: any) {
        this.selectedProductImage = event.target.files[0];
    }
}
