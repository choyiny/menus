// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { AdminRoutingModule } from './admin-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Components
import { MenuDashboardComponent } from './menu-dashboard/menu-dashboard.component';
import { CreateComponent } from './create/create.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

@NgModule({
  declarations: [
    MenuDashboardComponent,
    CreateComponent,
    AdminDashboardComponent,
    ViewUsersComponent,
    CreateUserComponent,
    EditUserComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, FontAwesomeModule, FormsModule, ReactiveFormsModule],
})
export class AdminModule {}
