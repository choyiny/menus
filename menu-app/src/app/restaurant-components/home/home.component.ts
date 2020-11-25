import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../interfaces/restaurant-interfaces';
import { AuthService } from '../../services/auth.service';
import { RestaurantPermissionService } from '../../services/restaurantPermission.service';

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
  previewMode = false;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private globalService: RestaurantPermissionService
  ) {}

  updatePreviewMode(previewMode: boolean): void {
    this.previewMode = previewMode;
  }

  updateRestaurant(restaurant: Restaurant): void {
    this.restaurant = restaurant;
  }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params.slug;
    const user = this.authService.currentUserValue;
    if (user) {
      this.hasPermission = user.is_admin || user.restaurants.includes(this.slug);
    } else {
      this.hasPermission = false;
    }
    if (this.slug != null) {
      this.restaurantService.getRestaurant(this.slug).subscribe(
        (restaurant) => {
          this.globalService.setPermission(this.hasPermission);
          this.globalService.setRestaurantPermissions(restaurant);
          this.globalService.setSlug(this.slug);
          this.restaurant = restaurant;
        },
        (err) => {
          console.log(err);
          this.viewable = false;
        }
      );
    }
  }
}
