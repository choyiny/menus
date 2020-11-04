import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth-components/login/login.component';
import { DashboardComponent } from './auth-components/dashboard/dashboard.component';
import { AdminGuard } from './guards/admin.guard';
import { MenuComponent } from './menu-components/menu/menu.component';
import {RestaurantComponent} from "./restaurant-components/restaurant/restaurant.component";

const routes: Routes = [
  {
    path: 'menu/:slug',
    component: MenuComponent
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin-components/admin.module').then((module) => module.AdminModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'restaurant/:slug',
    component: RestaurantComponent
  },
  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
