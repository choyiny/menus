import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { LazyMenu } from '../../../interfaces/restaurant-interfaces';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { RestaurantPermissionService } from '../../../services/restaurantPermission.service';
import { ActivatedRoute, Router } from '@angular/router';
import {EditService} from "../../../services/edit.service";

@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.scss'],
})
export class MenuModalComponent implements OnInit {
  @ViewChild('menuModal') menuModal;
  menus: LazyMenu[];
  slug: string;
  currentMenu: number;
  @Output() indexEmitter = new EventEmitter<number>();

  // icons
  checkIcon = faCheck;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { menus: LazyMenu[]; currentMenu: number },
    private restaurantPermissionService: RestaurantPermissionService,
    private bottomSheetRef: MatBottomSheetRef<MenuModalComponent>,
    private router: Router,
    private editService: EditService
  ) {
    this.menus = data.menus;
    this.currentMenu = data.currentMenu;
  }

  ngOnInit(): void {
    this.restaurantPermissionService.getSlug().subscribe((slug) => (this.slug = slug));
  }

  convertTime(time: number): string {
    // convert elapsed seconds to human readable time
    const h = Math.floor(time / 3600);
    const m = Math.floor((time - h * 3600) / 60);
    return `${h % 12 === 0 ? 12 : h % 12}:${m < 10 ? `0${m}` : m} ${h < 12 ? 'AM' : 'PM'}`;
  }

  changeMenu(index: number): void {
    this.bottomSheetRef.dismiss();
    this.bottomSheetRef.afterDismissed().subscribe(() => {
      const menu = this.menus[index].name;
      // Set Menu Name for editService on Switch Menu
      this.editService.menuName = this.menus[index].name
      this.router.navigateByUrl(`/restaurants/${this.slug}?menu=${menu}`).then(() => {});
    });
  }
}
