import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantPaginated } from '../../interfaces/restaurant-interfaces';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  limit: number;
  page: number;
  restaurants: RestaurantPaginated;
  constructor(
    private adminService: AdminService,
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe((params) => {
      if (params.limit && params.page) {
        this.limit = +params.limit;
        this.page = +params.page;
        this.getRestaurants();
      } else {
        this.visit({ limit: 5, page: 1 });
      }
    });
  }

  visit(query): void {
    this.router.navigate(['admin/menus'], { queryParams: query });
  }

  getRestaurants(): void {
    this.adminService
      .getRestaurants({
        page: this.page,
        limit: this.limit,
      })
      .subscribe((restaurants) => {
        this.restaurants = restaurants;
      });
  }
}
