import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {MenuInterface} from '../interfaces/MenuInterface';
import {SectionInterface} from '../interfaces/SectionIterface';
import {MenuItemInterface} from '../interfaces/MenuItemInterface';
import {TagInterface} from "../interfaces/TagInterface";

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private url = 'http://127.0.0.1:5000/menus/';

  constructor(private http: HttpClient) { }
  getMenu(slug: string): Observable<MenuInterface>{
    return this.http.get<MenuInterface>(this.url + `/${slug}`);
  }


}
