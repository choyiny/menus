import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { faMobileAlt } from '@fortawesome/pro-light-svg-icons';
import {SignupComponent} from '../register/signup/signup.component';
import {RestaurantService} from '../../services/restaurant.service';
import {Restaurant} from '../../interfaces/restaurant-interfaces';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  mobileIcon = faMobileAlt;
  @Input() isPublic: boolean;
  @Input() restaurantName: string;
  @Input() slug: string;
  @ViewChild(SignupComponent) signUp: SignupComponent;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {}

  publish(): void {
    this.restaurantService.editRestaurant(this.slug, {public: !this.isPublic}).subscribe(
      (restaurant) => {},
      (err) => {
        console.log(err);
        if (err.error.description === 'Please connect this account') {
          this.signUp.open();
        }
      }
    );
  }
}
