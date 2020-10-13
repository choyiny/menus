import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu-components/menu/menu.component';
import { LoginComponent } from './auth-components/login/login.component';
import { DashboardComponent } from './auth-components/dashboard/dashboard.component';
import { MenuDashboardComponent } from './admin-components/menu-dashboard/menu-dashboard.component';
import { CreateComponent } from './admin-components/create/create.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { AdminDashboardComponent as Admin } from './admin-components/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  { path: 'menu/:slug', component: MenuComponent },
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin/menu', component: MenuDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/create', component: CreateComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: Admin, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
