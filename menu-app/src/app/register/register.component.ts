import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FirstMenuComponent } from '../util-components/register/first-menu/first-menu.component';
import { Restaurant } from '../interfaces/restaurant-interfaces';
import { RestaurantService } from '../services/restaurant.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild(FirstMenuComponent) registerMenu: FirstMenuComponent;
  constructor(private restaurantService: RestaurantService, private auth: AuthService) {}

  restaurant: Restaurant;
  hasPermission: boolean;
  slug: string;

  ngOnInit(): void {
    this.auth.anonymousSignIn().subscribe((user) => {
      console.log(user);
      this.restaurantService.onboardRestaurant().subscribe((slug) => {
        console.log(slug);
        this.restaurantService.getRestaurant(slug).subscribe((restaurant) => {
          console.log(restaurant);
          this.auth.reloadUser().subscribe((newUser) => {
            console.log(newUser);
            this.hasPermission = user.restaurants.includes(slug);
            this.restaurant = restaurant;
            this.slug = slug;
          });
        });
      });
    });
  }

  ngAfterViewInit(): void {
    this.registerMenu.open();
  }
}
