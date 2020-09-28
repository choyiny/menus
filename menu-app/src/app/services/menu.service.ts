import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuInterface } from '../interfaces/menu-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private url: string = environment.menu_api;

  constructor(private http: HttpClient) {}
  getMenu(slug: string): Observable<MenuInterface> {
    return this.http.get<MenuInterface>(`${this.url}/menus/${slug}`);
  }

  uploadPhoto(slug: string, item: string, uploadForm): Observable<string> {
    const url = `${this.url}/menus/${slug}/items/${item}/pictures/upload`;
    return this.http.post<string>(url, uploadForm);
  }
}
