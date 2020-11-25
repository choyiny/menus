import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { faMobileAlt } from '@fortawesome/pro-light-svg-icons';
import { SignupComponent } from '../register/signup/signup.component';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../interfaces/restaurant-interfaces';
import {RestaurantPermissionService} from '../../services/restaurantPermission.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  mobileIcon = faMobileAlt;
  @ViewChild(SignupComponent) signUp: SignupComponent;
  @Output() restaurantEmitter = new EventEmitter<Restaurant>();
  restaurantName: string;
  isPublic: boolean;
  slug: string;

  constructor(private restaurantService: RestaurantService, public globalService: RestaurantPermissionService) {}

  ngOnInit(): void {
    this.globalService.restaurantNameObservable.subscribe(restaurantName => this.restaurantName = restaurantName);
    this.globalService.isRestaurantPublicObservable.subscribe(isPublic => this.isPublic = isPublic);
    this.globalService.slugObservable.subscribe(slug => this.slug = slug);

  }

  publish(): void {
    this.restaurantService.editRestaurant(this.slug, { public: ! this.isPublic }).subscribe(
      (restaurant) => {
        window.alert(`Your restaurant is now ${!this.isPublic ? 'public' : 'private'}`);
        this.restaurantEmitter.emit(restaurant);
      },
      (err) => {
        console.log(err);
        if (err.error.description === 'Please connect this account') {
          this.signUp.open();
        }
      }
    );
  }
}
