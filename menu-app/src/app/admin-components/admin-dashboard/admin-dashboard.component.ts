import { Component, OnInit } from '@angular/core';
import { MenusAdminInterface as Menus } from '../../interfaces/menus-admin-interface';
import { MenuAdminInterface as Menu } from '../../interfaces/menu-admin-interface';
import { MenuService } from '../../services/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  limit: number = 20;
  page: number = 1;
  menu: Menus;
  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit(): void {
    this.menuService
      .getMenus({
        page: this.page,
        limit: this.limit,
      })
      .subscribe((menu) => {
        this.menu = menu;
      });
  }

  visit(menu: Menu): void {
    this.router.navigateByUrl('admin/menu', { state: { menu } });
  }
}
