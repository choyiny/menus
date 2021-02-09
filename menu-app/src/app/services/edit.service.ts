import { Injectable } from '@angular/core';
import { MenuEditable } from '../interfaces/restaurant-interfaces';

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private _edited = false;
  private _menuEditable: MenuEditable = {};
  private _menuName: string;

  constructor() { }

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
}
