import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

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

  login(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.authService.login(email, password).subscribe(
      (user) => {
        if (user.is_admin) {
          this.router.navigateByUrl('admin');
        } else {
          this.router.navigateByUrl('dashboard');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
