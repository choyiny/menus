import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    const user = this.auth.currentUserValue;
    if (user == null || !user.is_admin) {
      this.router.navigateByUrl('');
      return false;
    }
    return true;
  }
}
