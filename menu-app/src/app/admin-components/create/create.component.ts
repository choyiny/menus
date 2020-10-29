import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { CreateInterface } from '../../interfaces/menus-interface';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  restaurantBody: FormGroup;

  constructor(private fb: FormBuilder, private menuService: MenuService) { }

  ngOnInit(): void {
    this.restaurantBody = this.fb.group({
      name: [''],
      description: [''],
      image: [''],
      slug: [''],
      external_link: [''],
      link_name: [''],
    });
  }

  isEmpty(element: string): boolean {
    return element !== '';
  }

  submit(): void {
    const menu: CreateInterface = {};
    Object.keys(this.restaurantBody.value).forEach((key) => {
      if (this.restaurantBody.value[key] !== '') {
        menu[key] = this.restaurantBody.value[key];
      }
    });
    this.menuService.createMenu(menu).subscribe((menuObj) => { });
  }
}
