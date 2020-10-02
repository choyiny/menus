import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm;
  error: string;
  loggedIn = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    public angularAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }

  onSubmit(): void {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    this.authService.login(username, password).subscribe(
      (res) => {
        this.loggedIn = true;
      },
      (err) => {
        console.log(err);
        this.error = err.error.description;
      }
    );
  }

  login() {
    this.angularAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.angularAuth.signOut();
  }
}
