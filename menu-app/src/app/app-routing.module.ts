import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu-components/menu/menu.component';
import { LoginComponent } from './auth-components/login/login.component';
import { DashboardComponent } from './auth-components/dashboard/dashboard.component';
import { ImportComponent } from './admin-components/import/import.component';
import { CreateComponent } from './admin-components/create/create.component';

const routes: Routes = [
  { path: 'menu/:slug', component: MenuComponent },
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/import', component: ImportComponent },
  { path: 'dashboard/create', component: CreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
