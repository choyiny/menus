import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MenusInterface } from '../../interfaces/menus-interface';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private fb: FormBuilder
  ) {}

  createUserForm = this.fb.group({
    email: [''],
    email_verified: [false],
    phone_number: [''],
    password: [''],
    display_name: [''],
    photo_url: [''],
  });

  selectPermissionForm = this.fb.group({
    restaurants: this.fb.group({}),
  });

  linkFirebaseUserForm = this.fb.group({
    firebase_id: [''],
  });

  menus: MenusInterface;

  ngOnInit(): void {
    this.adminService.getRestaurants({ limit: 100, page: 1 }).subscribe((restaurantData) => {
      const restaurants = <FormGroup> this.selectPermissionForm.get('restaurants');
      for (const restaurant of restaurantData.restaurants) {
        restaurants.addControl(restaurant, new FormControl());
      }
    });
  }

  get restaurantsFormData(): any {
    return Object.entries(this.selectPermissionForm.get('restaurants').value)
      .filter(([k, v]) => v)
      .map(([k, v]) => k);
  }

  submitLink(): void {
    const firebase_id = this.linkFirebaseUserForm.value.firebase_id;
    const restaurants = this.restaurantsFormData;
    this.userService.updateUser({ firebase_id, restaurants}).subscribe((result) => {
      alert('Success!');
    });
  }

  submitCreate(): void {
    const userInfo = this.createUserForm.value;
    this.userService.createUser({ ...userInfo, restaurants: this.restaurantsFormData }).subscribe((result) => {
      alert('Success!');
    });
  }
}
