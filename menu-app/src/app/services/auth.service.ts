import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/user-interface';
import { BehaviorSubject, Observable, from, ReplaySubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

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

  public reloadUser(firebaseId: string): Observable<UserInterface> {
    const url = `${environment.settings.endpoint}/users/${firebaseId}`;
    const observable = new ReplaySubject<UserInterface>();
    this.http.get<UserInterface>(url).subscribe((user) => {
      this.currentUserSubject = new BehaviorSubject<UserInterface>(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      observable.next(user);
    });
    return observable;
  }

  public getUserIdToken(): any {
    return this.authFireBase.idToken;
  }

  public anonymousSignIn(): Observable<UserInterface> {

    return from(this.authFireBase.signInAnonymously())
      .pipe(
        mergeMap((credentials) => {
          const url = `${environment.settings.endpoint}/anonymous`;
          const anonymousUser = credentials.user;
          return this.http.post<UserInterface>(url, { firebase_id: anonymousUser.uid });
        })
      )
      .pipe(
        mergeMap((user) => {
          this.currentUserSubject = new BehaviorSubject<UserInterface>(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          return of(user);
        })
      );
  }

  public upgradeUser(): Observable<UserInterface> {
    const url = `${environment.settings.endpoint}/anonymous`;
    return this.http.patch<UserInterface>(url, {}).pipe(mergeMap(
      user => {
        this.currentUserSubject = new BehaviorSubject<UserInterface>(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return of(user);
      }
    ));
  }

  loginWithGoogle(): Observable<UserInterface> {
    const firebaseObservable = from(
      this.authFireBase.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    );
    return firebaseObservable.pipe(
      mergeMap((userCredentials) => {
        const userId = userCredentials.user.uid;
        return this.reloadUser(userId);
      })
    );
  }

  login(email: string, password: string): Observable<UserInterface> {
    const firebaseObservable = from(this.authFireBase.signInWithEmailAndPassword(email, password));
    return firebaseObservable.pipe(
      mergeMap((userCredentials) => {
        return this.http.post<any>(`${environment.settings.endpoint}/auth/`, {}).pipe(
          map((user) => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            // update subject
            this.currentUserSubject = new BehaviorSubject<UserInterface>(user);
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
