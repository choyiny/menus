import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth-components/login/login.component';
import { DashboardComponent } from './auth-components/dashboard/dashboard.component';
import { AdminGuard } from './guards/admin.guard';
import { RegisterComponent } from './register/register.component';
import { VerificationComponent } from './auth-components/verification/verification.component';
import { HomeComponent } from './restaurant-components/home/home.component';
import { MenuRecognizerComponent } from './restaurant-components/menu-recognizer/menu-recognizer.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      url: 'externalUrlRedirectResolver',
    },
    data: {
      externalUrl: 'https://pickeasy.ca',
    },
  },
  {
    path: 'menu/:slug',
    redirectTo: '/restaurants/:slug' + '?from=legacy',
    pathMatch: 'full',
  },
  {
    path: 'menu/:slug/import',
    component: MenuRecognizerComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'verification',
    component: VerificationComponent,
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin-components/admin.module').then((module) => module.AdminModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'restaurants/:slug',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
