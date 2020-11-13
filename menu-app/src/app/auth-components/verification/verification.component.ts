import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/auth";
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import * as firebase from "firebase";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

  constructor(private router: Router, private auth: AngularFireAuth, private authService: AuthService) { }

  ngOnInit(): void {
    this.auth.user.subscribe(
      firebaseUser => {
        this.authService.upgradeUser().subscribe(
          user => {
            this.router.navigateByUrl('');
          }
        )
      }
    );
  }
}
