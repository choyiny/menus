import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/user-interface';
import {BehaviorSubject, Observable, from, ReplaySubject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserInterface>;
  public currentUser: Observable<UserInterface>;
  public authStatus = new ReplaySubject<UserInterface>(1);

  constructor(private http: HttpClient, private authFireBase: AngularFireAuth) {
    this.currentUserSubject = new BehaviorSubject<UserInterface>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserInterface {
    return this.currentUserSubject.value;
  }

  public reloadUser(firebaseId: string): void {
    const url = `${environment.settings.endpoint}/users/${firebaseId}`;
    this.http.get<UserInterface>(url).subscribe(
      user => {
        this.authStatus.next(user);
        this.currentUserSubject = new BehaviorSubject<UserInterface>(user);
      }
    );
  }

  public getUserIdToken(): any {
    return this.authFireBase.idToken;
  }

  public anonymousSignIn(): void {
    this.authFireBase.signInAnonymously().then((credentials) => {
      const url = `${environment.settings.endpoint}/anonymous`;
      const anonymousUser = credentials.user;
      this.http
        .post<UserInterface>(url, { firebase_id: anonymousUser.uid })
        .subscribe((user) => {
          this.currentUserSubject = new BehaviorSubject<UserInterface>(user);
          this.authStatus.next(user);
        });
    });
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
            this.authStatus.next(user);
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
