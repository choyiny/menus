import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { LazyMenu } from '../../../interfaces/restaurant-interfaces';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { RestaurantPermissionService } from '../../../services/restaurantPermission.service';

@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.scss'],
})
export class MenuModalComponent implements OnInit {
  @ViewChild('menuModal') menuModal;
  menus: LazyMenu[];
  currentMenu;
  @Output() indexEmitter = new EventEmitter<number>();

  // icons
  checkIcon = faCheck;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { menus: LazyMenu[] },
    private restaurantPermissionService: RestaurantPermissionService,
    private bottomSheetRef: MatBottomSheetRef<MenuModalComponent>
  ) {
    this.menus = data.menus;
  }

  ngOnInit(): void {
    this.restaurantPermissionService
      .getMenuIndex()
      .subscribe((index) => (this.currentMenu = index));
  }

  convertTime(time: number): string {
    // convert elapsed seconds to human readable time
    const h = Math.floor(time / 3600);
    const m = Math.floor((time - h * 3600) / 60);
    return `${h % 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
  }

  changeMenu(index: number): void {
    this.bottomSheetRef.dismiss();
    this.restaurantPermissionService.setMenuIndex(index);
  }
}
