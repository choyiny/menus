import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu-components/menu/menu.component';
import { LoginComponent } from './auth-components/login/login.component';

const routes: Routes = [
  { path: 'menu/:slug', component: MenuComponent },
  { path: '', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
