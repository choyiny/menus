import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import * as FileSaver from 'file-saver';
import { MenuInterface } from '../../interfaces/menus-interface';
import {Form, FormBuilder, FormGroup} from '@angular/forms';
import { TracingService } from '../../services/tracing.service';
import {Restaurant} from "../../interfaces/restaurant-interfaces";
import {RestaurantService} from "../../services/restaurant.service";
import {AdminService} from "../../services/admin.service";

@Component({
  selector: 'app-menu-dashboard',
  templateUrl: './menu-dashboard.component.html',
  styleUrls: ['./menu-dashboard.component.scss'],
})
export class MenuDashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private restaurantService: RestaurantService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private tracingService: TracingService
  ) {}

  restaurant: Restaurant;
  file: File;
  slug: string;
  configureContactTracing = false;
  contactTracingForm: FormGroup;
  selectedMenu: string;
  menuBody: FormGroup;

  ngOnInit(): void {
    this.slug = this.route.snapshot.params.slug;
    this.load();
    this.menuBody = this.fb.group({
      name: ['']
    });
  }

  load(): void {
    if (this.slug != null) {
      this.restaurantService.getRestaurant(this.slug).subscribe((restaurant) => {
        this.restaurant = restaurant;
        this.contactTracingForm = this.fb.group({
          enable_trace: [this.restaurant.enable_trace],
          force_trace: [this.restaurant.force_trace],
          tracing_key: [this.restaurant.tracing_key],
        });
      });
    }
  }

  onChange(event): void {
    this.file = event.target.files[0];
  }

  menuOptions(): string[] {
    return ['Make new menus', ...this.restaurant.menus];
  }

  importCsv(): void {
    const name = this.menuBody.value.name;
    if (name) {
      const formData = new FormData();
      formData.append('file', this.file);
      this.adminService.importMenu(this.slug, name, formData).subscribe(
        restaurant => {
          this.load();
          window.alert('Success!');
        },
        err => {
          window.alert('Something went wrong!');
          console.log(err);
        }
      );
    } else {
      window.alert('enter a name first');
    }
  }

  appendCsv(): void {
    const formData = new FormData();
    formData.append('file', this.file);
    this.adminService.appendMenu(this.slug, this.selectedMenu, formData).subscribe((menu) => {
      window.alert('Success!');
    });
  }

  deleteMenu(): void {
    this.restaurantService.deleteMenu(this.slug, this.selectedMenu).subscribe(
      menu => {
        this.load();
        window.alert('Success!');
      }
    );
  }

  generateQr(): void {
    let body;
    if (this.restaurant.enable_trace) {
      body = {
        url: `${window.location.origin}/menu/${this.slug}?trace=true`,
        name: this.restaurant.name,
      };
    } else {
      body = {
        url: `${window.location.origin}/menu/${this.slug}`,
        name: this.restaurant.name,
      };
    }
    this.menuService.generateQR(body).subscribe((blob) => {
      const fileName = `${this.restaurant.name}.${blob.type}`;
      FileSaver.saveAs(blob, fileName);
    });
  }

  toggleContactTracing(): void {
    this.configureContactTracing = !this.configureContactTracing;
  }

  submitContactTracing(): void {
    const tracingForm = this.contactTracingForm.value;
    this.tracingService.configureTracing(this.slug, tracingForm).subscribe((menu) => {
      this.restaurant = menu;
    });
    this.configureContactTracing = false;
  }
}
