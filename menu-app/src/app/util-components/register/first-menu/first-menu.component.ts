import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { Router } from '@angular/router';
import { RestaurantPermissionService } from '../../../services/restaurantPermission.service';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-first-menu',
  templateUrl: './first-menu.component.html',
  styleUrls: ['./first-menu.component.scss'],
})
export class FirstMenuComponent implements OnInit {
  newMenu: FormGroup;

  @ViewChild('firstMenu') firstMenu;
  @Input() slug: string;
  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
  };

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private auth: AuthService,
    private angularAuth: AngularFireAuth,
    private restaurantService: RestaurantService,
    private router: Router,
    private rPS: RestaurantPermissionService
  ) {}

  ngOnInit(): void {
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
    this.modalService.open(this.firstMenu, this.modalOptions);
  }

  importNewMenu(modal): void {
    // Promise.all , get slug and menu at the same time
    forkJoin({
      slug: this.rPS.getSlug().pipe(take(1)),
      menuName: this.rPS.getMenuName().pipe(take(1)),
    }).subscribe((res) => {
      console.log(res);
      const { slug, menuName } = res;
      this.router.navigateByUrl(`menu/${slug}/import?menu=${menuName}`).then(() => {
        modal.close();
      });
    });
  }
}
