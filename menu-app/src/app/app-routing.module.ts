import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu-components/menu/menu.component';
import { LoginComponent } from './auth-components/login/login.component';
import { DashboardComponent } from './auth-components/dashboard/dashboard.component';
import { MenuDashboardComponent } from './admin-components/menu-dashboard/menu-dashboard.component';
import { CreateComponent } from './admin-components/create/create.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminDashboardComponent as Admin } from './admin-components/admin-dashboard/admin-dashboard.component';

import { CreateUserComponent } from './admin-components/create-user/create-user.component';
import { EditUserComponent } from './admin-components/edit-user/edit-user.component';
import { ViewUsersComponent } from './admin-components/view-users/view-users.component';

const routes: Routes = [
  { path: 'menu/:slug', component: MenuComponent },
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin/menus/:slug', component: MenuDashboardComponent, canActivate: [AdminGuard] },
  { path: 'admin/create', component: CreateComponent, canActivate: [AdminGuard] },
  { path: 'admin/menus', component: Admin, canActivate: [AdminGuard] },
  { path: 'admin/users', component: ViewUsersComponent, canActivate: [AdminGuard] },
  { path: 'admin/users/create', component: CreateUserComponent, canActivate: [AdminGuard] },
  { path: 'admin/users/:id', component: EditUserComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
