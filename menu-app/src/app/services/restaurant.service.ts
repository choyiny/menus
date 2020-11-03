import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Menu, Restaurant, RestaurantEditable} from '../interfaces/restaurant-interfaces';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) { }

  getRestaurant(slug: string): Observable<Restaurant>{
    const url = `${environment.settings.apiv2}/restaurant/${slug}`;
    return this.http.get<Restaurant>(url);
  }

  getMenus(slug: string, menuName: string): Observable<Menu> {
    const url = `${environment.settings.apiv2}/restaurant/${slug}/${menuName}`;
    return this.http.get<Menu>(url);
  }

  editRestaurant(slug: string, restaurant: RestaurantEditable): Observable<Restaurant> {
    const url = `${environment.settings.apiv2}/restaurant/${slug}`;
    return this.http.patch<Restaurant>(url, restaurant);
  }
}
