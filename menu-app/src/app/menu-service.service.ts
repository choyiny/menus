import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {MenuInterface} from './interfaces/MenuInterface';

@Injectable({
  providedIn: 'root'
})
export class MenuServiceService {
  private url = 'http://127.0.0.1:5000/';

  constructor(private http: HttpClient) { }
  getMenu(slug: string): Observable<MenuInterface>{
    const params = {slug};
    return this.http.get<MenuInterface>(this.url, {params});
  }
}
