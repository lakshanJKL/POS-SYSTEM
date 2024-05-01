import {Component} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize, Observable} from "rxjs";
import {MatProgressBar} from "@angular/material/progress-bar";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatExpansionModule, MatExpansionPanel, MatExpansionPanelTitle} from "@angular/material/expansion";
import {RouterOutlet} from "@angular/router";
import {MatProgressSpinner, MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-new-customer',
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
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.scss'
})
export class NewCustomerComponent {
  panelOpenState: boolean = false;
  loading: boolean = false;
  selectedAvatar: any;
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
    fullName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    avatar: new FormControl('', [Validators.required])
  })


  saveCustomer() {
    this.loading = true;
    const path = 'avatar/ ' + this.form.value.fullName + '/' + this.selectedAvatar.name;
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path, this.selectedAvatar);

    this.uploadRate = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadLink = fileRef.getDownloadURL();
      })
    ).subscribe();

    task.then(() => {

      this.downloadLink.subscribe(res => {
        let customers = {
          fullName: this.form.value.fullName,
          address: this.form.value.address,
          salary: this.form.value.salary,
          avatar: res
        }
        //=======Save customer=========
        this.db.collection('customers').add(customers)
          .then((docRef) => {
            this.snackBar.open('Customer Saved!', 'Close', {
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
    this.selectedAvatar = event.target.files[0];
  }
}
