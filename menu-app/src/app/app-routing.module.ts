import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth-components/login/login.component';
import { DashboardComponent } from './auth-components/dashboard/dashboard.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'menu',
    loadChildren: () =>
      import('./menu-components/menu.module').then((module) => module.MenuModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin-components/admin.module').then((module) => module.AdminModule),
    canActivate: [AdminGuard],
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
