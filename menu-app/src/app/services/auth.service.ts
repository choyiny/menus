import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/user-interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserInterface>;
  public currentUser: Observable<UserInterface>;

  constructor(private http: HttpClient, private env: EnvService) {
    this.currentUserSubject = new BehaviorSubject<UserInterface>(
      JSON.parse(sessionStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserInterface {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<UserInterface> {
    return this.env.getEnvironment().pipe(
      mergeMap((environment) => {
        return this.http
          .post<any>(
            `${environment.settings.endpoint}/auth/`,
            { username, password },
            { headers: { 'Content-Type': 'application/json' } }
          )
          .pipe(
            map((user) => {
              user.authdata = window.btoa(username + ':' + password);
              sessionStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
              return user;
            })
          );
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
  }
}
