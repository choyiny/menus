import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserInterface } from '../../interfaces/user-interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm;
  restaurant: string;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.restaurant = params.restaurant;
    });

    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle().subscribe((user) => {
      this.onSuccess(user);
    });
  }

  onSuccess(user: UserInterface): void {
    if (user.is_admin) {
      this.router.navigate(['admin/menus'], { queryParams: { limit: 5, page: 1 } }).then(() => {});
    } else {
      // Temporary fix, will add functionality to immediately redirect user to their restaurant in the future
      // if (this.restaurant) {
      //   this.router.navigate([`restaurants/${this.restaurant}`]).then(() => {
      //     window.alert('Congratulations! Account verified');
      //   });
      // } else {
      //   this.router.navigate(['dashboard']).then(() => {});
      // }
      this.router.navigate(['dashboard']).then(() => {});
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
