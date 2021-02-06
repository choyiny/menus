import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Menu,
  Restaurant,
  RestaurantPaginated,
  RestaurantTemplate,
} from '../interfaces/restaurant-interfaces';
import { environment } from '../../environments/environment';
import * as FileSaver from 'file-saver';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getRestaurants(query): Observable<RestaurantPaginated> {
    const url = `${environment.settings.endpoint}/admin/restaurants`;
    return this.http.get<RestaurantPaginated>(url, { params: query });
  }

  importMenu(slug: string, menuName: string, formData: FormData): Observable<Menu> {
    const url = `${environment.settings.endpoint}/admin/restaurants/${slug}/menus/${menuName}/import`;
    return this.http.post<Menu>(url, formData);
  }

  createRestaurant(restaurantTemplate: RestaurantTemplate): Observable<Restaurant> {
    const url = `${environment.settings.endpoint}/admin/restaurants`;
    return this.http.post<Restaurant>(url, restaurantTemplate);
  }

  appendMenu(slug: string, selectedMenu: string, formData: FormData): Observable<Menu> {
    const url = `${environment.settings.endpoint}/admin/restaurants/${slug}/menus/${selectedMenu}/import`;
    return this.http.patch<Menu>(url, formData);
  }

  generateQR(slug): Observable<any> {
    const url = `${environment.settings.endpoint}/admin/generate/${slug}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      mergeMap((blob) => {
        const fileName = `${slug}.${blob.type}`;
        FileSaver.saveAs(blob, fileName);
        return of(blob);
      })
    );
  }
}
