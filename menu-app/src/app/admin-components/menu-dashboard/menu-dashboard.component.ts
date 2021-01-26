import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Restaurant, Menu, MenuVersion } from '../../interfaces/restaurant-interfaces';
import { RestaurantService } from '../../services/restaurant.service';
import { AdminService } from '../../services/admin.service';

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
    private fb: FormBuilder
  ) {}

  restaurant: Restaurant;
  file: File;
  menu: Menu;
  slug: string;
  configureContactTracing = false;
  contactTracingForm: FormGroup;
  selectedMenu: string;
  menuBody: FormGroup;
  qrcodeLink: string;
  configureQrCodeLink = false;
  selectedVersion: MenuVersion;

  // Constants
  hours = [...Array(24).keys()];
  minutes = [...Array(60).keys()];
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;

  ngOnInit(): void {
    this.slug = this.route.snapshot.params.slug;
    this.load();
    this.menuBody = this.fb.group({
      name: [''],
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

  initTime(): void {
    const menu = this.restaurant.menus.find((lazyMenu) => lazyMenu.name === this.selectedMenu);
    this.restaurantService.getMenus(this.slug, this.selectedMenu).subscribe((res) => {
      this.menu = res;
    });
    const resetTime = () => {
      this.startHour = 0;
      this.startMinute = 0;
      this.endHour = 0;
      this.endMinute = 0;
    };
    if (menu) {
      if (menu.start && menu.end) {
        this.startHour = Math.floor(menu.start / 3600);
        this.startMinute = Math.floor((menu.start - this.startHour * 3600) / 60);
        this.endHour = Math.floor(menu.end / 3600);
        this.endMinute = Math.floor((menu.end - this.endHour * 3600) / 60);
      } else {
        resetTime();
      }
    } else {
      resetTime();
    }
  }

  onChange(event): void {
    this.file = event.target.files[0];
  }

  menuOptions(): string[] {
    return ['Make new menus', ...this.restaurant.menus.map((menu) => menu.name)];
  }

  importCsv(): void {
    const name = this.menuBody.value.name;
    if (name) {
      const formData = new FormData();
      formData.append('file', this.file);
      this.adminService.importMenu(this.slug, name, formData).subscribe(
        (restaurant) => {
          this.load();
          window.alert('Success!');
        },
        (err) => {
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
    this.restaurantService.deleteMenu(this.slug, this.selectedMenu).subscribe((menu) => {
      this.load();
      window.alert('Success!');
    });
  }

  deleteRestaurant(): void {
    this.restaurantService.deleteRestaurant(this.slug).subscribe((restaurant) => {
      window.alert('Success!');
    });
  }

  generateQr(): void {
    this.adminService.generateQR(this.slug).subscribe(() => {});
  }

  toggleContactTracing(): void {
    this.configureContactTracing = !this.configureContactTracing;
  }

  submitContactTracing(): void {
    const tracingForm = this.contactTracingForm.value;
    this.restaurantService.editRestaurant(this.slug, tracingForm).subscribe((restaurant) => {
      this.restaurant = restaurant;
    });
    this.configureContactTracing = false;
  }

  configureQrCode(): void {
    this.restaurantService
      .editRestaurant(this.slug, { qrcode_link: this.qrcodeLink })
      .subscribe(() => {
        this.configureQrCodeLink = false;
      });
  }

  toggleConfigureQRCode(): void {
    this.configureQrCodeLink = !this.configureQrCodeLink;
  }

  getHours(): string[] {
    const am = [...Array(12).keys()].map((time) => `${time} AM`);
    const pm = [...Array(12).keys()].map((time) => `${time} PM`);
    am[0] = '12 Am';
    pm[0] = '12 Pm';
    return [...am, ...pm];
  }

  saveTimes(): void {
    const start = this.startHour * 3600 + this.startMinute * 60;
    const end = this.endHour * 3600 + this.endMinute * 60;
    this.restaurantService.editMenu(this.slug, this.selectedMenu, { start, end }).subscribe(() => {
      const menu = this.restaurant.menus.find((menuElem) => menuElem.name === this.selectedMenu);
      menu.start = start;
      menu.end = end;
      window.alert('Success');
    });
  }

  revertMenu(): void {
    const name = this.selectedVersion.name;
    const sections = this.selectedVersion.sections;
    //Start & End times not working ATM
    // const start = this.selectedVersion.start
    // const end = this.selectedVersion.end
    const footnote = this.selectedVersion.footnote;
    this.restaurantService
      .editMenu(this.slug, this.selectedMenu, { sections, footnote, name })
      .subscribe(() => {
        window.alert('Reverted');
      });
  }
  updateCanUpload(): void {
    this.restaurantService
      .editRestaurant(this.slug, { can_upload: !this.restaurant.can_upload })
      .subscribe((restaurant) => {
        this.restaurant = restaurant;
        window.alert(`Image upload ${restaurant.can_upload ? 'enabled' : 'disabled'}`);
      });
  }
}
