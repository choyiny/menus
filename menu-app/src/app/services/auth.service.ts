import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/user-interface';
import { BehaviorSubject, Observable, from, ReplaySubject } from 'rxjs';
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

  public reloadUser(firebaseId: string): Observable<UserInterface> {
    const url = `${environment.settings.endpoint}/users/${firebaseId}`;
    const observable = new ReplaySubject<UserInterface>();
    this.http.get<UserInterface>(url).subscribe((user) => {
      console.log(user);
      this.authStatus.next(user);
      this.currentUserSubject = new BehaviorSubject<UserInterface>(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      observable.next(user);
    });
    return observable;
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
          console.log(user);
          this.currentUserSubject = new BehaviorSubject<UserInterface>(user);
          this.authStatus.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
        });
    });
  }

  public upgradeUser(): Observable<UserInterface> {
    const url = `${environment.settings.endpoint}/anonymous`;
    const userObserver = new ReplaySubject<UserInterface>();
    this.http.patch<UserInterface>(url, {} ).subscribe(
      user => {
        this.currentUserSubject = new BehaviorSubject<UserInterface>(user);
        this.authStatus.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        userObserver.next(user);
      }
    );
    return userObserver;
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
