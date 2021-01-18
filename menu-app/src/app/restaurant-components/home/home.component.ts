import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  // State
  hasPermission: boolean;
  viewable = true;
  previewMode = false;

  // Style
  theme = {
    height: '50px',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private restaurantPermissionService: RestaurantPermissionService
  ) {}

  updatePreviewMode(previewMode: boolean): void {
    if (!previewMode) {
      this.loadRestaurant();
    }
    this.previewMode = previewMode;
  }

  updateRestaurant(restaurant: Restaurant): void {
    this.restaurant = restaurant;
  }

  loadRestaurant(): void {
    if (this.slug != null) {
      this.restaurantService.getRestaurant(this.slug).subscribe(
        (restaurant) => {
          this.restaurantPermissionService.setPermission(this.hasPermission);
          this.restaurantPermissionService.setRestaurantPermissions(restaurant);
          this.restaurantPermissionService.setSlug(this.slug);
          this.restaurant = restaurant;
        },
        (err) => {
          console.log(err);
          this.viewable = false;
        }
      );
    }
  }

  loadUser(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.hasPermission = user.is_admin || user.restaurants.includes(this.slug);
    } else {
      this.hasPermission = false;
    }
  }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params.slug;
    if (String(this.route.snapshot.routeConfig.path).substring(0, 4) === 'menu') {
      this.router.navigateByUrl(`/restaurants/${this.slug}?from=legacy`);
    }
    this.loadUser();
    this.loadRestaurant();
  }
}
