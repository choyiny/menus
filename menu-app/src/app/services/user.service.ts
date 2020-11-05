import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  UserInterface,
  UsersWithPaginationInterface,
  NewUserInterface,
  LinkUserInterface,
} from '../interfaces/user-interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  getUsers(query): Observable<UsersWithPaginationInterface> {
    const url = `${environment.settings.endpoint}/users`;
    return this.http.get<UsersWithPaginationInterface>(url, { params: query });
  }

  getUser(firebaseId: string): Observable<UserInterface> {
    const url = `${environment.settings.endpoint}/users/${firebaseId}`;
    return this.http.get<UserInterface>(url);
  }

  createUser(user: NewUserInterface): Observable<UserInterface> {
    const url = `${environment.settings.endpoint}/users`;
    return this.http.post<UserInterface>(url, user);
  }

  updateUser(info: LinkUserInterface): Observable<UserInterface> {
    const url = `${environment.settings.endpoint}/users`;
    return this.http.post<UserInterface>(url, info);
  }
}
