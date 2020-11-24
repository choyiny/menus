import { Injectable } from '@angular/core';
import {Restaurant} from '../interfaces/restaurant-interfaces';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  hasPermission: boolean;
  slug: string;
  canUpload: boolean;
  isRestaurantPublic: boolean;

  constructor() { }

  setPermission(permission: boolean): void {
    this.hasPermission = permission;
  }

  getPermission(): boolean {
    return this.hasPermission;
  }

  setSlug(slug: string): void {
    this.slug = slug;
  }

  getSlug(): string {
    return this.slug;
  }

  setRestaurantPermissions(restaurant: Restaurant): void {
    this.canUpload = restaurant.can_upload;
    this.isRestaurantPublic = restaurant.public;
  }

  isPublic(): boolean {
    return this.isRestaurantPublic;
  }

  canRestaurantUpload(): boolean {
    return this.canUpload;
  }

}
