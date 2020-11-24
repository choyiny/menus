import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import { Menu, Restaurant, RestaurantEditable } from '../../interfaces/restaurant-interfaces';
import { CovidModalComponent } from '../../util-components/covid-modal/covid-modal.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ScrollService } from '../../services/scroll.service';
import { TimeInterface } from '../../interfaces/time-interface';
import { RestaurantService } from '../../services/restaurant.service';
import { SignupComponent } from '../../util-components/register/signup/signup.component';
import {GlobalService} from '../../services/global.service';
@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit, AfterViewInit {
  @Input() restaurant: Restaurant;
  @Input() selectedImage: string;
  menus = [];
  currentMenu = 0;

  slug: string;
  hasPermission: boolean;

  @ViewChild(CovidModalComponent) covid: CovidModalComponent;
  @ViewChild(SignupComponent) signUp: SignupComponent;
  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private scrollService: ScrollService,
    public globalService: GlobalService,
  ) {}

  ngAfterViewInit(): void {
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
  }

  ngOnInit(): void {
    this.globalService.slugObservable.subscribe( slug => this.slug = slug);
    this.globalService.hasPermissionObservable.subscribe( hasPermission => this.hasPermission = hasPermission);
    this.loadMenus();
  }

  loadMenus(): void {
    for (let i = 0; i < this.restaurant.menus.length; i++) {
      const menuName = this.restaurant.menus[i];
      this.restaurantService.getMenus(this.slug, menuName).subscribe((menu) => {
        if (i === this.currentMenu) {
          this.globalService.setMenuName(menuName);
        }
        this.menus[i] = menu;
      });
    }
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

  updateRestaurant(restaurant: Restaurant): void {
    this.restaurant = restaurant;
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
}
