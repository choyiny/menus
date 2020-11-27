import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TracingService } from '../../services/tracing.service';
import {LazyMenu, Restaurant} from '../../interfaces/restaurant-interfaces';
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
    private fb: FormBuilder,
  ) {}

  restaurant: Restaurant;
  file: File;
  slug: string;
  configureContactTracing = false;
  contactTracingForm: FormGroup;
  selectedMenu: string;
  menuBody: FormGroup;
  qrcodeLink: string;
  configureQrCodeLink = false;

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

  onChange(event): void {
    this.file = event.target.files[0];
  }

  menuOptions(): string[] {
    return ['Make new menus', ...this.restaurant.menus.map( menu => menu.name)];
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
    const saveQrCode = () => {
      this.adminService.generateQR(this.slug).subscribe(
        (blob) => {
          const fileName = `${this.restaurant.name}.${blob.type}`;
          FileSaver.saveAs(blob, fileName);
        },
        (err) => {
          console.log(err);
        }
      );
    };

    if (!this.restaurant.qrcode_link) {
      const url = `${window.location.origin}/restaurants/${this.slug}`;
      this.restaurantService.editRestaurant(this.slug, { qrcode_link: url }).subscribe(() => {
        saveQrCode();
      });
    } else {
      saveQrCode();
    }
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

  updateCanUpload(): void {
    this.restaurantService
      .editRestaurant(this.slug, { can_upload: !this.restaurant.can_upload })
      .subscribe((restaurant) => {
        this.restaurant = restaurant;
        window.alert(`Image upload ${restaurant.can_upload ? 'enabled' : 'disabled'}`);
      });
  }
}
