import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Menu, Restaurant, RestaurantEditable } from '../../interfaces/restaurant-interfaces';
import { CovidModalComponent } from '../../util-components/modals/covid-modal/covid-modal.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ScrollService } from '../../services/scroll.service';
import { TimeInterface } from '../../interfaces/time-interface';
import { RestaurantService } from '../../services/restaurant.service';
import {SignupComponent} from "../../util-components/register/signup/signup.component";
@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit {
  @Input() restaurant: Restaurant;
  menus = [];
  currentMenu = 0;
  miniScroll = false;
  previousScroll = 0;
  selectedSection = 0;
  @Input() selectedImage: string;
  slug: string;

  // true if user has permission to edit this menuv2
  hasPermission: boolean;

  @ViewChild(CovidModalComponent) covid: CovidModalComponent;
  @ViewChild(SignupComponent) signUp: SignupComponent;
  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params.slug;
    if (this.slug != null) {
      this.getRestaurant();
    }
    const user = this.authService.currentUserValue;
    if (user) {
      this.hasPermission = user.is_admin || user.restaurants.includes(this.slug);
    } else {
      this.hasPermission = false;
    }
  }

  loadMenus(): void {
    for (let i = 0; i < this.restaurant.menus.length; i++) {
      const menuName = this.restaurant.menus[i];
      this.restaurantService.getMenus(this.slug, menuName).subscribe((menu) => {
        this.menus[i] = menu;
      });
    }
  }

  getRestaurant(): void {
    this.restaurantService.getRestaurant(this.slug).subscribe((restaurant) => {
      this.restaurant = restaurant;
      console.log(restaurant);
      this.loadMenus();
      if (this.sameDay()) {
        return;
      }
      if (this.restaurant.force_trace) {
        this.covid.open();
        return;
      }
      this.route.queryParams.subscribe((params) => {
        const trace: boolean = params.trace === 'true';
        if (trace && this.restaurant.enable_trace) {
          this.covid.open();
        }
      });
    });
  }

  scrollToSection(id: string): void {
    this.scrollService.scrollToSection(id);
  }

  setValue(editable: RestaurantEditable): void {
    // tslint:disable-next-line:forin
    this.restaurantService.editRestaurant(this.slug, editable).subscribe((restaurant) => {
      this.restaurant = restaurant;
      this.loadMenus();
    });
  }

  sameDay(): boolean {
    if (localStorage.getItem('time_in')) {
      const timeIn: TimeInterface = JSON.parse(localStorage.getItem('time_in'));
      const date = new Date(timeIn.time_in);
      const today = new Date();
      if (
        today.getDay() === date.getDay() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear()
      ) {
        return true;
      }
    } else {
      return false;
    }
  }

  publish(): void {
    this.restaurantService.publishRestaurant(this.slug).subscribe(
      restaurant => {
        this.restaurant = restaurant;
      },
      err => {
        console.log(err);
      }
    );
  }
}
