import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Item, Menu, Restaurant, RestaurantEditable} from '../interfaces/restaurant-interfaces';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) { }

  getRestaurant(slug: string): Observable<Restaurant>{
    const url = `${environment.settings.apiv2}/restaurants/${slug}`;
    return this.http.get<Restaurant>(url);
  }

  getMenus(slug: string, menuName: string): Observable<Menu> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/menus/${menuName}`;
    return this.http.get<Menu>(url);
  }

  editRestaurant(slug: string, restaurant: RestaurantEditable): Observable<Restaurant> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}`;
    return this.http.patch<Restaurant>(url, restaurant);
  }

  editItem(slug: string, menuName: string, item: Item) {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/menus/${menuName}/items/${item._id}`;
    return this.http.patch<Item>(url, item);
  }
}
