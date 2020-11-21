import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Menu,
  Restaurant,
  RestaurantPaginated,
  RestaurantTemplate,
} from '../interfaces/restaurant-interfaces';
import { environment } from '../../environments/environment';

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
    const url = `${environment.settings.endpoint}/admin/restaurants`;
    return this.http.patch<Menu>(url, formData);
  }

  generateQR(slug): Observable<Blob> {
    const url = `${environment.settings.endpoint}/admin/generate/${slug}`;
    return this.http.get(url, { responseType: 'blob', });
  }

  updateQrCode(slug: string, qrcodeLink: string): Observable<Restaurant> {
    const url = `${environment.settings.endpoint}/admin/generate/${slug}`;
    return this.http.patch<Restaurant>(url, { qrcode_link: qrcodeLink });
  }
}
