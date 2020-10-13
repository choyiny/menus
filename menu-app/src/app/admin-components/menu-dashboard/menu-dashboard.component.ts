import { Component, OnInit } from '@angular/core';
import { MenuAdminInterface as Menu } from '../../interfaces/menu-admin-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-dashboard',
  templateUrl: './menu-dashboard.component.html',
  styleUrls: ['./menu-dashboard.component.scss'],
})
export class MenuDashboardComponent implements OnInit {
  constructor(private router: Router) {
    // does not work on ngOnInit
    const state = this.router.getCurrentNavigation().extras.state;
    if (state) {
      this.menuInfo = state.menu;
    }
  }

  menuInfo: Menu;

  ngOnInit(): void {}
}
