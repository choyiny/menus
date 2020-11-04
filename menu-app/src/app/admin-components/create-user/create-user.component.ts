import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MenuService } from '../../services/menu.service';
import { MenusInterface } from '../../interfaces/menus-interface';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  constructor(
    private userService: UserService,
    private menuService: MenuService,
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
    menus: this.fb.group({}),
  });

  linkFirebaseUserForm = this.fb.group({
    firebase_id: [''],
  });

  menus: MenusInterface;

  ngOnInit(): void {
    this.menuService.getMenus({ limit: 100, page: 1 }).subscribe((menusData) => {
      const menus = <FormGroup>this.selectPermissionForm.get('menus');
      for (let menu of menusData.menus) {
        menus.addControl(menu, new FormControl());
      }
    });
  }

  get menusFormData() {
    return Object.entries(this.selectPermissionForm.get('menus').value)
      .filter(([k, v]) => v)
      .map(([k, v]) => k);
  }

  submitLink(): void {
    const menus = this.menusFormData;
    const firebase_id = this.linkFirebaseUserForm.value.firebase_id;

    this.userService.updateUser({ firebase_id, menus }).subscribe((result) => {
      alert('Success!');
    });
  }

  submitCreate(): void {
    const menus = this.menusFormData;
    const userInfo = this.createUserForm.value;

    this.userService.createUser({ ...userInfo, menus }).subscribe((result) => {
      alert('Success!');
    });
  }
}
