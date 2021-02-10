import { Injectable } from '@angular/core';
import { RestaurantService } from './restaurant.service';
import { MenuEditable } from '../interfaces/restaurant-interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class EditService {
  private _edited = false;
  private _menuEditable: MenuEditable = {};
  private _menuName: string;
  private _slug: string;

  constructor(private restaurantService: RestaurantService, private snackBar: MatSnackBar) {}

  get edited(): any {
    return this._edited;
  }
  set edited(edited: any) {
    this._edited = edited;
  }

  get menuEditable(): any {
    return this._menuEditable;
  }
  set menuEditable(menuEditable: any) {
    this._menuEditable = menuEditable;
  }

  get menuName(): any {
    return this._menuName;
  }
  set menuName(menuName: any) {
    this._menuName = menuName;
  }

  get slug(): any {
    return this._slug;
  }
  set slug(slug: any) {
    this._slug = slug;
  }

  handler = function (e) {
    e.preventDefault();
    e.returnValue = 'abcs';
  };

  saveVersion() {
    if (this.edited) {
      this.restaurantService
        .editMenu(this.slug, this.menuName, this.menuEditable)
        .subscribe((menu) => {
          this.snackBar.open('Saved', '', {
            duration: 2000,
          });
          window.removeEventListener('beforeunload', this.handler);
          this.edited = false;
        });
    }
  }
}
