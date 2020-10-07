import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, public angularAuth: AngularFireAuth) {}

  ngOnInit(): void {}

  login(): void {
    this.authService.login().subscribe(
      (user) => {},
      (err) => {
        console.log(err);
      }
    );
  }
  logout(): void {
    this.angularAuth.signOut();
  }
}
