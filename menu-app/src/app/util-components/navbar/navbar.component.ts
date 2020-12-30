import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { faMobileAlt } from '@fortawesome/pro-light-svg-icons';
import { SignupComponent } from '../register/signup/signup.component';
import { RestaurantService } from '../../services/restaurant.service';
import { RestaurantPermissionService } from '../../services/restaurantPermission.service';
import { PublishModalComponent } from '../register/publish-modal/publish-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  mobileIcon = faMobileAlt;
  @Input() previewMode: boolean;
  @Input() restaurantName: string;
  @ViewChild(SignupComponent) signUp: SignupComponent;
  @ViewChild(PublishModalComponent) publishModal: PublishModalComponent;
  @Output() viewEmitter = new EventEmitter<boolean>();
  isPublic: boolean;
  slug: string;

  constructor(
    private restaurantService: RestaurantService,
    public restaurantPermissionService: RestaurantPermissionService
  ) {}

  ngOnInit(): void {
    this.restaurantPermissionService.isRestaurantPublicObservable.subscribe(
      (isPublic) => (this.isPublic = isPublic)
    );
    this.restaurantPermissionService.slugObservable.subscribe((slug) => (this.slug = slug));
  }

  mobileView(): void {
    this.viewEmitter.emit(!this.previewMode);
  }

  publish(): void {
    this.restaurantService.editRestaurant(this.slug, { public: !this.isPublic }).subscribe(
      (restaurant) => {
        if (restaurant.public) {
          this.publishModal.open();
        } else {
          window.alert('Your restaurant is now private');
        }
        this.restaurantPermissionService.setRestaurantPermissions(restaurant);
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
