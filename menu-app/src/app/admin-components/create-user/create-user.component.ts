import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MenuService } from '../../services/menu.service';
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

  restaurants: string[];
  selectedRestaurant = '';

  linkFirebaseUserForm = this.fb.group({
    firebase_id: [''],
  });

  menus: MenusInterface;

  ngOnInit(): void {
    this.adminService.getRestaurants({ limit: 100, page: 1 }).subscribe((restaurantData) => {
      this.restaurants = restaurantData.restaurants;
    });
  }

  submitLink(): void {
    const firebase_id = this.linkFirebaseUserForm.value.firebase_id;

    // this.userService.updateUser({ firebase_id, restaurant: this.selectedRestaurant}).subscribe((result) => {
    //   alert('Success!');
    // });
  }

  submitCreate(): void {
    const userInfo = this.createUserForm.value;
    this.userService.createUser({ ...userInfo, restaurant: this.selectedRestaurant }).subscribe((result) => {
      alert('Success!');
    });
  }
}
