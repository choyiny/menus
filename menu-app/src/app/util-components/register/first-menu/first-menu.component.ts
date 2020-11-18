import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';
import { RestaurantService } from '../../../services/restaurant.service';
import {Menu} from '../../../interfaces/restaurant-interfaces';

@Component({
  selector: 'app-first-menu',
  templateUrl: './first-menu.component.html',
  styleUrls: ['./first-menu.component.scss'],
})
export class FirstMenuComponent implements OnInit {
  newMenu: FormGroup;

  @ViewChild('firstMenu') firstMenu;
  @Input() slug: string;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private auth: AuthService,
    private angularAuth: AngularFireAuth,
    private restaurantService: RestaurantService,
  ) {}

  ngOnInit(): void {
    console.log(this.slug, 'le slug');
    this.newMenu = this.fb.group({
      name: [''],
      sectionName: [''],
      itemName: [''],
      itemDescription: [''],
      itemPrice: [''],
    });
  }

  next(modal): void {
    // sign in to get access to backend
    const onboarding = {
      name: this.newMenu.value.name,
      section_name: this.newMenu.value.sectionName,
      item_name: this.newMenu.value.itemName,
      item_description: this.newMenu.value.itemDescription,
      item_price: this.newMenu.value.itemPrice,
    };
    this.restaurantService.onboard(this.slug, onboarding).subscribe((menu) => {
      modal.close();
      window.location.reload();
    });
  }

  open(): void {
    this.modalService.open(this.firstMenu);
  }
}
