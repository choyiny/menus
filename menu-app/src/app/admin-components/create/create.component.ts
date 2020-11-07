import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { CreateInterface } from '../../interfaces/menus-interface';
import { AdminService } from '../../services/admin.service';
import { Restaurant, RestaurantTemplate } from '../../interfaces/restaurant-interfaces';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  restaurantBody: FormGroup;
  menuBody: FormGroup;
  file: File;
  recentSlug: string;

  constructor(private fb: FormBuilder, private adminService: AdminService) {}

  ngOnInit(): void {
    this.restaurantBody = this.fb.group({
      name: [''],
      description: [''],
      image: [''],
      slug: [''],
    });
    this.menuBody = this.fb.group({
      name: [''],
    });
  }

  isEmpty(element: string): boolean {
    return element !== '';
  }

  submit(): void {
    const restaurantTemplate: RestaurantTemplate = this.restaurantBody.value;
    if (restaurantTemplate.slug) {
      this.adminService.createRestaurant(restaurantTemplate).subscribe((restaurant) => {
        window.alert('Success!');
        this.recentSlug = restaurantTemplate.slug;
      });
    } else {
      window.alert('Please create a restaurant first');
    }
  }

  import(): void {
    const menuName = this.menuBody.value.name;
    const formData = new FormData();
    formData.append('file', this.file);
    this.adminService.importMenu(this.recentSlug, menuName, formData).subscribe((menu) => {
      window.alert('Success!');
    });
  }

  onChange(event): void {
    this.file = event.target.files[0];
  }
}
