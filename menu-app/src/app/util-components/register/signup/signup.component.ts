import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AuthService } from '../../../services/auth.service';
import { take } from 'rxjs/operators';
import { RestaurantService } from '../../../services/restaurant.service';
import { PublishModalComponent } from '../publish-modal/publish-modal.component';
import { RestaurantPermissionService } from '../../../services/restaurantPermission.service';
import { UserService } from '../../../services/user.service';

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
    private restaurantPermissionsService: RestaurantPermissionService,
    private userService: UserService
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
      anonymousUser.linkWithPopup(new firebase.auth.GoogleAuthProvider()).then(
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
    this.userService.getUserByEmail(this.email).subscribe((res) => {
      if (res.email !== undefined) {
        this.errorMessage = 'User already in use, please login to access existing account';
      } else {
        this.errorMessage = '';
        this.auth.user.pipe(take(1)).subscribe((anonymousUser) => {
          const credentials = firebase.auth.EmailAuthProvider.credential(this.email, this.password);
          anonymousUser.linkWithCredential(credentials).then((userCredentials) => {
            const location = window.location.origin;
            this.authService.sendEmail(this.email, location).subscribe(() => {
              window.alert(
                'After verifying your email, menu is ready for publishing, click publish again to make menu public!'
              );
              modal.close();
            });
          });
        });
      }
    });
  }
}
