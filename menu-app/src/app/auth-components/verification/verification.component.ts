import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit {
  status = 'Currently verifying email ... please wait';
  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const email = params.email;
      this.auth.signInWithEmailLink(email, window.location.href).then(
        (res) => {
          console.log(res);
          this.authService.upgradeUser().subscribe((user) => {
            this.status = 'Success!';
            this.router.navigateByUrl('');
          });
        },
        (err) => {
          console.log(err);
          this.status = 'Something went wrong!';
        }
      );
    });
  }
}
