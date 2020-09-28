import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  error: string;
  loggedIn = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    this.auth.login(username, password).subscribe(
      (res) => {
        this.loggedIn = true;
      },
      (err) => {
        console.log(err);
        this.error = err.error.description;
      }
    );
  }
}
