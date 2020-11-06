import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AngularFireAuth} from "@angular/fire/auth";
import * as firebase from "firebase";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private modalService: NgbModal, private auth: AngularFireAuth) { }
  @ViewChild('signup') signup;

  ngOnInit(): void {
  }

  open(): void {
    this.modalService.open(this.signup);
  }

  signInWithFacebook(): void {
    this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(
      user => {
        console.log(user);
      }
    );
  }

  signInWithGoogle(): void {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      user => {
        console.log(user);
      }
    );
  }

}
