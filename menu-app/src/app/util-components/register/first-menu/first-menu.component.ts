import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../interfaces/restaurant-interfaces';
import {mergeMap} from 'rxjs/operators';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-first-menu',
  templateUrl: './first-menu.component.html',
  styleUrls: ['./first-menu.component.scss'],
})
export class FirstMenuComponent implements OnInit {
  newMenu: FormGroup;
  restaurantEmitter = new EventEmitter<Restaurant>();

  @ViewChild('firstMenu') firstMenu;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private auth: AuthService,
    private angularAuth: AngularFireAuth,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.newMenu = this.fb.group({
      name: [''],
      sectionName: [''],
      itemName: [''],
      itemDescription: [''],
      itemPrice: [''],
    });
  }

  next(): void {

    const name: string = this.newMenu.value.name;
    const sectionName: string = this.newMenu.value.sectionName;
    const itemName: string = this.newMenu.value.itemName;
    const itemDescription: string = this.newMenu.value.itemDescription;
    const itemPrice: string = this.newMenu.value.itemPrice;
    const slug = Math.random().toString(36).substring(7);
    const menuName = 'Menu';
    this.auth.anonymousSignIn();
    this.auth.authStatus.subscribe(
      // wait for anonymous user to be created
      user => {
        this.restaurantService.postRestaurant({slug, name}).subscribe(
          restaurant => {
            // wait for menu, item and section
            console.log(restaurant);
            forkJoin({
              menu: this.restaurantService.addMenu(slug, menuName),
              item: this.restaurantService.newItem(),
              section: this.restaurantService.newSection(),
            }).subscribe(
              // create new menu after all observables return
              // forkJoin == Promise.all
              data => {
                console.log(data);
                const item = data.item;
                const menu  = data.menu;
                const section = data.section;
                item.name = itemName;
                item.description = itemDescription;
                item.price = itemPrice;
                section.name = sectionName;
                section.menu_items = [item];
                menu.sections = [section];
                this.restaurantService.editMenu(slug, menu.name, {sections: menu.sections}).subscribe(
                  menuData => {
                    // emit restaurant to parent
                    console.log(restaurant);
                    restaurant.menus = [menuData.name];
                    this.restaurantEmitter.emit(restaurant);
                  }
                );
              },
              err => {
                console.log(err);
              }
            );
          }
        );
      }
    );
  }

  open(): void {
    this.modalService.open(this.firstMenu);
  }
}
