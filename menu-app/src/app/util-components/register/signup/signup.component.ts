import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private auth: AngularFireAuth,
    private authService: AuthService
  ) {}
  @ViewChild('signup') signup;
  email: string;
  password: string;

  ngOnInit(): void {}

  open(): void {
    this.modalService.open(this.signup);
  }

  signInWithFacebook(): void {
    const currentUser = this.auth.user;
    this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then((user) => {});
  }

  signInWithGoogle(modal): void {
    this.auth.user.subscribe((anonymousUser) => {
      anonymousUser.linkWithPopup(new firebase.auth.GoogleAuthProvider()).then(
        (userCred) => {
          this.authService.upgradeUser().subscribe((user) => {
            modal.close();
          });
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  next(modal): void {
    this.auth.user.subscribe((anonymousUser) => {
      const credentials = firebase.auth.EmailAuthProvider.credential(this.email, this.password);
      anonymousUser.linkWithCredential(credentials).then((userCredentials) => {
        const location = window.location.origin;
        this.authService.sendEmail(this.email, location).subscribe(() => {
          window.alert('Email sent!');
          modal.close();
        });
      });
    });
  }
}
