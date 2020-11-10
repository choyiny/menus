import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AuthService } from '../../../services/auth.service';
import { AuthService as SocialService} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import {from} from 'rxjs';

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
    private socialService: SocialService
  ) {}
  @ViewChild('signup') signup;
  email: string;

  ngOnInit(): void {}

  open(): void {
    this.modalService.open(this.signup);
  }

  signInWithFacebook(): void {
    const currentUser = this.auth.user;
    console.log(currentUser);
    this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then((user) => {
      console.log(user);
    });
  }

  signInWithGoogle(): void {
    this.auth.currentUser.then(
      anonymousUser => {
        anonymousUser.linkWithPopup(new firebase.auth.GoogleAuthProvider()).then(
          user => {
            console.log(user);
          },
          err => {
            console.log(err);
          }
        );
      }
    );
  }

  next(): void {
    console.log(this.email);
    const actionCodeSettings = {
      url: window.location.origin,
      handleCodeInApp: true,
    };
    this.auth.sendSignInLinkToEmail(this.email, actionCodeSettings).then(
      (user) => {
        console.log('done?');
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
