import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressBar} from "@angular/material/progress-bar";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {finalize, Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatProgressSpinner, MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIcon} from "@angular/material/icon";


@Component({
  selector: 'app-update-customer',
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
  templateUrl: './update-customer.component.html',
  styleUrl: './update-customer.component.scss'
})

export class UpdateCustomerComponent implements OnInit {
  customerId: any;
  loading: any = false;

  selectedAvatar: any;

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
      this.customerId = res.get('id');
    })
  }

  form = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    avatar: new FormControl('', [Validators.required])
  })


  updateCustomer() {

    const path = 'avatar/ ' + this.form.value.fullName + '/' + this.selectedAvatar.name;
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path, this.selectedAvatar);

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
          fullName: this.form.value.fullName,
          address: this.form.value.address,
          salary: this.form.value.salary,
          avatar: res
        }
        //=======update=========
        const cusRef = this.db.collection('customers').doc(this.customerId);
        cusRef.update(customers)
          .then((docRef) => {

            this.loading = false;
            this.router.navigateByUrl("/dashboard/customers").then(()=>{

              this.snackBar.open('Customer Updated !', 'Close', {
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
    this.selectedAvatar = event.target.files[0];
  }

  ngOnInit(): void {
    let cusRef = this.db.collection("customers").doc(this.customerId);
    cusRef.get().subscribe((doc) => {
      if (doc.exists) {
        let data: any = doc.data();
        this.form.setValue({
          fullName: data.fullName,
          address: data.address,
          salary: data.salary,
          avatar: null
        });
      }
    });
  }
}
