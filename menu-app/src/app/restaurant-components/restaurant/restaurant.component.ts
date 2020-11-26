import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Menu, Restaurant, RestaurantEditable } from '../../interfaces/restaurant-interfaces';
import { CovidModalComponent } from '../../util-components/covid-modal/covid-modal.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ScrollService } from '../../services/scroll.service';
import { TimeInterface } from '../../interfaces/time-interface';
import { RestaurantService } from '../../services/restaurant.service';
import { SignupComponent } from '../../util-components/register/signup/signup.component';
import { RestaurantPermissionService } from '../../services/restaurantPermission.service';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { MenuModalComponent } from '../../util-components/menu-util/menu-modal/menu-modal.component';
@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit, AfterViewInit {
  @Input() restaurant: Restaurant;
  @Input() selectedImage: string;
  menus = [];
  currentMenu = -1;

  slug: string;
  hasPermission: boolean;

  @ViewChild(CovidModalComponent) covid: CovidModalComponent;
  @ViewChild(SignupComponent) signUp: SignupComponent;
  @ViewChild(MenuModalComponent) menuModal: MenuModalComponent;
  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private scrollService: ScrollService,
    public restaurantPermissionService: RestaurantPermissionService
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

  updateRestaurant(restaurant: Restaurant): void {
    this.restaurant = restaurant;
  }

  ngOnInit(): void {
    this.restaurantPermissionService.slugObservable.subscribe((slug) => (this.slug = slug));
    this.restaurantPermissionService.hasPermissionObservable.subscribe(
      (hasPermission) => (this.hasPermission = hasPermission)
    );
    this.loadMenus();
  }

  loadMenus(): void {
    const setMenu = (i: number, menus: Menu[]) => {
      this.currentMenu = i;
      this.restaurantPermissionService.setMenuName(menus[i].name);
      this.menus = menus;
    };

    forkJoin(
      this.restaurant.menus.map((menu) => {
        return this.restaurantService.getMenus(this.slug, menu).pipe(take(1));
      })
    ).subscribe((menus) => {
      const currentTime = this.getCurrentTime();
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].start < currentTime && currentTime < menus[i].end) {
          setMenu(i, menus);
          return;
        }
      }
      setMenu(0, menus);
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

  getCurrentTime(): number {
    const today = new Date();
    const [h, m, s] = [today.getHours(), today.getMinutes(), today.getSeconds()];
    // convert hours:minutes:seconds to elapsed time in seconds
    return h * 3600 + m * 60 + s;
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
