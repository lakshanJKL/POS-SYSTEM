import {Routes} from '@angular/router';
import {DashboardHomeComponent} from './components/dashboard-home/dashboard-home.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {CustomerComponent} from './components/customer/customer.component';
import {NewCustomerComponent} from './components/customer/inner/new-customer/new-customer.component';
import {UpdateCustomerComponent} from './components/customer/inner/update-customer/update-customer.component';
import {AllCustomerComponent} from './components/customer/inner/all-customer/all-customer.component';
import {ProductComponent} from "./components/product/product.component";
import {NewProductComponent} from "./components/product/inner/new-product/new-product.component";
import {UpdateProductComponent} from "./components/product/inner/update-product/update-product.component";
import {AllProductComponent} from "./components/product/inner/all-product/all-product.component";
import {NewOrderComponent} from "./components/order/inner/new-order/new-order.component";
import {AllOrderComponent} from "./components/order/inner/all-order/all-order.component";

export const routes: Routes = [
  {path: '', redirectTo: '/dashboard/home', pathMatch: 'full'},
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {path: '', redirectTo: '/dashboard/home', pathMatch: 'full'},
      {path: 'home', component: DashboardHomeComponent},
      {
        path: 'customers',
        loadComponent: () => import("./components/customer/customer.component").then(c => c.CustomerComponent),
        children: [
          {
            path: '',
            redirectTo: '/dashboard/customers/new',
            pathMatch: 'full',
          },
          {
            path: 'new', component: NewCustomerComponent,
            children: [
              {
                path: '',
                redirectTo: '/dashboard/customers/new/all',
                pathMatch: "full"
              },
              {
                path: 'all', component: AllCustomerComponent, children: [
                  {path: 'update/:id', component: UpdateCustomerComponent}
                ]
              }
            ]
          }
        ],
      },
      {
        path: 'products',
        loadComponent: () => import("./components/product/product.component").then(p => p.ProductComponent),
        children: [
          {
            path: '',
            redirectTo: '/dashboard/products/new',
            pathMatch: 'full'
          },
          {
            path: 'new', component: NewProductComponent, children: [
              {path: '', redirectTo: "/dashboard/products/new/all", pathMatch: "full"},
              {
                path: 'all', component: AllProductComponent, children: [
                  {path: "update/:id", component: UpdateProductComponent}
                ]
              }
            ]
          },
        ]
      },
      {
        path: "orders",
        loadComponent: () => import("./components/order/order.component").then(o => o.OrderComponent),
        children: [
          {path: "", redirectTo: "/dashboard/orders/new", pathMatch: "full"},
          {path: "new", component: NewOrderComponent, children: [
              {path: "", redirectTo: "/dashboard/orders/new/all", pathMatch: "full"},
              {path: "all", component: AllOrderComponent}
            ]
          }
        ]
      }
    ],
  },
];
