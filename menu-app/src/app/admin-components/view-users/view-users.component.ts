import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersInterface } from '../../interfaces/user-interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss'],
})
export class ViewUsersComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) {}

  users: UsersInterface = { users: [] };
  current_page: number;
  total_page: number;
  per_page: number;

  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe((params) => {
      if (params.limit && params.page) {
        this.per_page = +params.limit;
        this.current_page = +params.page;
        this.userService
          .getUsers({ limit: this.per_page, page: this.current_page })
          .subscribe(({ total_page, users }) => {
            this.total_page = total_page;
            this.users = { users };
          });
      } else {
        this.reloadWithParams({ limit: 20, page: 1 });
      }
    });
  }

  reloadWithParams(queryParams: { limit: number; page: number }) {
    this.router.navigate(['admin', 'users'], { queryParams });
  }

  goToViewUser(firebaseId: string): void {
    this.router.navigate(['admin', 'users', firebaseId]);
  }

  goToCreateUser(): void {
    this.router.navigate(['admin', 'users', 'create']);
  }
}
