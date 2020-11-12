import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../interfaces/restaurant-interfaces';
import { mergeMap, take } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-menu',
  templateUrl: './first-menu.component.html',
  styleUrls: ['./first-menu.component.scss'],
})
export class FirstMenuComponent implements OnInit {
  newMenu: FormGroup;

  @ViewChild('firstMenu') firstMenu;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private auth: AuthService,
    private angularAuth: AngularFireAuth,
    private restaurantService: RestaurantService,
    private router: Router
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
    const onboard = this.auth.anonymousSignIn().subscribe((user) => {
      const onboarding = {
        name: this.newMenu.value.name,
        section_name: this.newMenu.value.sectionName,
        item_name: this.newMenu.value.itemName,
        item_description: this.newMenu.value.itemDescription,
        item_price: this.newMenu.value.itemPrice,
      };
      this.restaurantService.onboardRestaurant(onboarding).subscribe((slug) => {
        this.auth
          .reloadUser(user.firebase_id)
          .subscribe((reloadedUser) => {
            modal.close();
            this.router.navigateByUrl(`restaurants/${slug}`);
            onboard.unsubscribe();
          });
      });
    });
  }

  open(): void {
    this.modalService.open(this.firstMenu);
  }
}
