import { Injectable } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant-interfaces';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestaurantPermissionService {
  hasPermissionObservable = new BehaviorSubject<boolean>(false);
  slugObservable = new BehaviorSubject<string>(null);
  canUploadObservable = new BehaviorSubject<boolean>(false);
  isRestaurantPublicObservable = new BehaviorSubject<boolean>(false);
  menuNameObservable = new BehaviorSubject<string>(null);

  constructor() {}

  setPermission(permission: boolean): void {
    this.hasPermissionObservable.next(permission);
  }

  getPermission(): Observable<boolean> {
    return this.hasPermissionObservable;
  }

  setSlug(slug: string): void {
    this.slugObservable.next(slug);
  }

  getSlug(): Observable<string> {
    return this.slugObservable;
  }

  setRestaurantPermissions(restaurant: Restaurant): void {
    this.canUploadObservable.next(restaurant.can_upload);
    this.isRestaurantPublicObservable.next(restaurant.public);
  }

  isPublic(): Observable<boolean> {
    return this.isRestaurantPublicObservable;
  }

  canRestaurantUpload(): BehaviorSubject<boolean> {
    return this.canUploadObservable;
  }

  getMenuName(): BehaviorSubject<string> {
    return this.menuNameObservable;
  }

  setMenuName(menuName: string): void {
    this.menuNameObservable.next(menuName);
  }
}
