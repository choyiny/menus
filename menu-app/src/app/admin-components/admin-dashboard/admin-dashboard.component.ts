import { Component, OnInit } from '@angular/core';
import { MenusInterface } from '../../interfaces/menus-interface';
import { MenuService } from '../../services/menu.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  limit: number;
  page: number;
  menu: MenusInterface;
  constructor(
    private menuService: MenuService,
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe((params) => {
      if (params.limit && params.page) {
        this.limit = +params.limit;
        this.page = +params.page;
        this.getMenus();
      } else {
        this.visit({ limit: 5, page: 1 });
      }
    });
  }

  visit(query): void {
    this.router.navigate(['admin/menus'], { queryParams: query });
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
