import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersInterface } from '../../interfaces/user-interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  users: UsersInterface = { users: [] };

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => { this.users = users });
  }

  goToViewUser(firebaseId: string): void {
    this.router.navigate(['admin', 'users', firebaseId]);
  }

  goToCreateUser(): void {
    this.router.navigate(['admin', 'users', 'create']);
  }
}
