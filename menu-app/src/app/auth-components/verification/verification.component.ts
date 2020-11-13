import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/auth";
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import * as firebase from "firebase";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

  constructor(private route: ActivatedRoute, private auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        const email = params.email;
        const password = params.password;
        this.auth.user.subscribe(
          userCred => {
            const credentials = firebase.auth.EmailAuthProvider.credential(email, password);
            userCred.linkWithCredential(credentials).then(
              user => {
                console.log(user);
              },
              err => {
                console.log(err);
              }
            );
          }
        );
    });
  }

}
