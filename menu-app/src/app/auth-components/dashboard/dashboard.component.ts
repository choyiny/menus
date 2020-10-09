import { Component, OnInit } from '@angular/core';
import { UserInterface } from '../../interfaces/user-interface';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: UserInterface;
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.user = this.auth.currentUserValue;
  }
}
