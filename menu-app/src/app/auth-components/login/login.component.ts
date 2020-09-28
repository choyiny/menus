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

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    this.auth.login(username, password).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => console.log('HTTP Error', err)
    );
  }
}
