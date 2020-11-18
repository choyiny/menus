import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../interfaces/restaurant-interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  slug: string;
  restaurant: Restaurant;
  hasPermission: boolean;
  viewable = true;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params.slug;
    console.log(this.slug, 'slug');
    const user = this.authService.currentUserValue;
    if (user) {
      this.hasPermission = user.is_admin || user.restaurants.includes(this.slug);
    } else {
      this.hasPermission = false;
    }
    if (this.slug != null) {
      this.restaurantService.getRestaurant(this.slug).subscribe(
        (restaurant) => {
          if (restaurant.public || user.restaurants.includes(this.slug)) {
            this.restaurant = restaurant;
          } else {
            this.viewable = false;
          }
        },
        (err) => {
          console.log(err);
          this.viewable = false;
        }
      );
    }
  }
}
