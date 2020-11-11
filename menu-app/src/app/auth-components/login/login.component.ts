import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {AngularFireAuth} from "@angular/fire/auth";
import {UserInterface} from "../../interfaces/user-interface";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle().subscribe(
      user => {
        this.onSuccess(user);
      }
    );
  }

  onSuccess(user: UserInterface): void {
    if (user.is_admin) {
      this.router.navigate(['admin/menus'], { queryParams: { limit: 5, page: 1 } });
    } else {
      this.router.navigateByUrl('dashboard');
    }
  }

  login(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.authService.login(email, password).subscribe(
      (user) => {
        this.onSuccess(user);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
