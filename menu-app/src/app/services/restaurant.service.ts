import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Item,
  Menu,
  MenuEditable,
  Restaurant,
  RestaurantEditable,
  RestaurantOnboarding,
  RestaurantTemplate,
  Section,
} from '../interfaces/restaurant-interfaces';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  constructor(private http: HttpClient) {}

  getRestaurant(slug: string): Observable<Restaurant> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}`;
    return this.http.get<Restaurant>(url);
  }

  postRestaurant(restaurantTemplate: RestaurantTemplate): Observable<Restaurant> {
    const url = `${environment.settings.apiv2}/restaurants`;
    return this.http.post<Restaurant>(url, restaurantTemplate);
  }

  editRestaurant(slug: string, restaurant: RestaurantEditable): Observable<Restaurant> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}`;
    return this.http.patch<Restaurant>(url, restaurant);
  }

  deleteRestaurant(slug: string): Observable<Restaurant> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}`;
    return this.http.delete<Restaurant>(url);
  }

  getMenus(slug: string, menuName: string): Observable<Menu> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/menus/${menuName}`;
    return this.http.get<Menu>(url);
  }

  editMenu(slug: string, menuName: string, menuEditable: MenuEditable): Observable<Menu> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/menus/${menuName}`;
    return this.http.patch<Menu>(url, menuEditable);
  }

  deleteMenu(slug: string, menuName: string): Observable<Menu> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/menus/${menuName}`;
    return this.http.delete<Menu>(url);
  }

  addMenu(slug: string, name: string): Observable<Menu> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/menus`;
    return this.http.post<Menu>(url, { name });
  }

  editItem(slug: string, menuName: string, item: Item): Observable<Item> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/menus/${menuName}/items/${item._id}`;
    return this.http.patch<Item>(url, item);
  }

  deleteItem(slug: string, menuName: string, itemId): Observable<Section> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/menus/${menuName}/items/${itemId}`;
    return this.http.delete<Section>(url);
  }

  newItem(): Observable<Item> {
    const url = `${environment.settings.apiv2}/items/new`;
    return this.http.get<Item>(url);
  }

  editSection(slug: string, menuName: string, section: Section): Observable<Section> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/menus/${menuName}/sections/${section._id}`;
    return this.http.patch<Section>(url, section);
  }

  deleteSection(slug: string, menuName: string, sectionId: string): Observable<Menu> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/menus/${menuName}/sections/${sectionId}`;
    return this.http.delete<Menu>(url);
  }

  newSection(): Observable<Section> {
    const url = `${environment.settings.apiv2}/sections/new`;
    return this.http.get<Section>(url);
  }

  uploadPhoto(
    slug: string,
    menuName: string,
    itemId: string,
    formData: FormData
  ): Observable<string> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/menus/${menuName}/items/${itemId}/picture`;
    return this.http.patch<string>(url, formData);
  }

  deletePhoto(slug: string, menuName: string, itemId: string): Observable<Item> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/menus/${menuName}/items/${itemId}/picture`;
    return this.http.delete<Item>(url);
  }

  onboardRestaurant(): Observable<string> {
    const url = `${environment.settings.apiv2}/restaurants/onboard`;
    return this.http.post<string>(url, {});
  }

  onboard(slug: string, restaurant: RestaurantOnboarding): Observable<Menu> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/onboard`;
    return this.http.patch<Menu>(url, restaurant);
  }

  uploadHeader(slug: string, formData: FormData): Observable<Restaurant> {
    const url = `${environment.settings.apiv2}/restaurants/${slug}/image`;
    return this.http.patch<Restaurant>(url, formData);
  }
}
