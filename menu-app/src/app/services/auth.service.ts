import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/user-interface';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserInterface>;
  public currentUser: Observable<UserInterface>;

  constructor(private http: HttpClient, private authFireBase: AngularFireAuth) {
    this.currentUserSubject = new BehaviorSubject<UserInterface>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserInterface {
    return this.currentUserSubject.value;
  }

  public getUserIdToken(): any {
    return this.authFireBase.idToken;
  }

  login(): Observable<UserInterface> {
    const firebaseObservable = from(
      this.authFireBase.signInWithPopup(new auth.GoogleAuthProvider())
    );
    return firebaseObservable.pipe(
      mergeMap((userCredentials) => {
        return this.http.post<any>(`${environment.settings.endpoint}/auth/`, {}).pipe(
          map((user) => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
          })
        );
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }
}
