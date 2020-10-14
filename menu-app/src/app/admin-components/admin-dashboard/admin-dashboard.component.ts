import { Component, OnInit } from '@angular/core';
import { PaginatedInterface, SlugInterface } from '../../interfaces/menus-interface';
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
  menu: PaginatedInterface;
  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit(): void {
    this.getMenus();
  }

  visit(menu: SlugInterface): void {
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
