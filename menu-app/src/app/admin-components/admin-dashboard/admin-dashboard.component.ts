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
  limit = 5;
  page = 1;
  menu: Menus;
  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit(): void {
    this.getMenus();
  }

  visit(menu: Menu): void {
    this.router.navigateByUrl('admin/menu', { state: { menu } });
  }

  nextPage(): void {
    this.page += 1;
    this.getMenus();
  }

  previousPage(): void {
    this.page -= 1;
    this.getMenus();
  }

  addLimit(): void {
    this.limit += 5;
    this.getMenus();
  }

  lowerLimit(): void {
    this.limit -= 5;
    this.getMenus();
  }

  getMenus(): void {
    this.menuService
      .getMenus({
        page: this.page,
        limit: this.limit,
      })
      .subscribe((menu) => {
        this.menu = menu;
      });
  }
}
