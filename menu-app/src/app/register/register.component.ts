import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FirstMenuComponent } from '../util-components/register/first-menu/first-menu.component';
import { RestaurantService } from '../services/restaurant.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild(FirstMenuComponent) registerMenu: FirstMenuComponent;
  slug: string;
  constructor(
    private restaurantService: RestaurantService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.anonymousSignIn().subscribe((user) => {
      this.restaurantService.onboardRestaurant().subscribe((slug) => {
        this.slug = slug;
        this.auth.reloadUser().subscribe((newUser) => {
          this.router.navigateByUrl(`restaurants/${slug}`).then((res) => {
            this.registerMenu.open();
          });
        });
      });
    });
  }
}
