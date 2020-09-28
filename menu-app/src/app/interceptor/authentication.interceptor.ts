import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const user = this.auth.currentUserValue;
    if (user && user.authdata) {
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${user.authdata}`,
        },
      });
    }
    return next.handle(request);
  }
}
