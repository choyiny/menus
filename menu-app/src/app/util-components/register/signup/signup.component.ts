import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AuthService } from '../../../services/auth.service';
import { take } from 'rxjs/operators';
import { RestaurantService } from '../../../services/restaurant.service';
import { PublishModalComponent } from '../publish-modal/publish-modal.component';
import { RestaurantPermissionService } from '../../../services/restaurantPermission.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private auth: AngularFireAuth,
    private authService: AuthService,
    private restaurantService: RestaurantService,
    private restaurantPermissionsService: RestaurantPermissionService
  ) {}

  @ViewChild('signup') signup;
  @ViewChild(PublishModalComponent) publishModal: PublishModalComponent;
  email: string;
  password: string;
  errorMessage: string;

  ngOnInit(): void {}

  open(): void {
    this.modalService.open(this.signup);
  }

  signInWithFacebook(): void {
    const currentUser = this.auth.user;
    this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then((user) => {});
  }

  signInWithGoogle(modal): void {
    this.auth.user.pipe(take(1)).subscribe((anonymousUser) => {
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('email');
      anonymousUser.linkWithPopup(provider).then(
        (userCred) => {
          this.authService.upgradeUser().subscribe((user) => {
            if (user.restaurants) {
              this.restaurantService
                .editRestaurant(user.restaurants[0], { public: true })
                .subscribe((restaurant) => {
                  modal.close();
                  this.restaurantPermissionsService.setRestaurantPermissions(restaurant);
                  this.publishModal.open();
                });
            }
          });
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  next(modal): void {
    this.auth.user.pipe(take(1)).subscribe((anonymousUser) => {
      const credentials = firebase.auth.EmailAuthProvider.credential(this.email, this.password);
      anonymousUser.linkWithCredential(credentials).then(
        (userCredentials) => {
          this.errorMessage = '';
          const location = window.location.origin;
          this.authService.sendEmail(this.email, location).subscribe(() => {
            window.alert(
              'After verifying your email, menu is ready for publishing, click publish again to make menu public!'
            );
            modal.close();
          });
        },
        (err) => {
          this.errorMessage = 'User already in use, please login to access existing account';
        }
      );
    });
  }
}
