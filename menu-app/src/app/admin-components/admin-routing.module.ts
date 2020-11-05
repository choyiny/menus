// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { MenuDashboardComponent } from './menu-dashboard/menu-dashboard.component';
import { CreateComponent } from './create/create.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

const routes: Routes = [
  {
    path: 'menus/:slug',
    component: MenuDashboardComponent,
  },
  {
    path: 'create',
    component: CreateComponent,
  },
  {
    path: 'menus',
    component: AdminDashboardComponent,
  },
  {
    path: 'users',
    component: ViewUsersComponent,
  },
  {
    path: 'users/create',
    component: CreateUserComponent,
  },
  {
    path: 'users/:id',
    component: EditUserComponent,
  },
  {
    path: '**',
    redirectTo: 'admin/menus',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
