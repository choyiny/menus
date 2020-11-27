import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MenuEditable } from '../../../interfaces/menus-interface';
import { faSave, faPen } from '@fortawesome/pro-solid-svg-icons';
import { RestaurantPermissionService } from '../../../services/restaurantPermission.service';

@Component({
  selector: 'app-menu-name',
  templateUrl: './menu-name.component.html',
  styleUrls: ['./menu-name.component.scss'],
})
export class MenuNameComponent implements OnInit {
  constructor(private restaurantPermissionService: RestaurantPermissionService) {}

  @Input() name: string;
  @Output() menuEmitter = new EventEmitter<MenuEditable>();
  editMode = false;

  // icons
  editIcon = faPen;
  saveIcon = faSave;

  hasPermission: boolean;

  ngOnInit(): void {
    this.restaurantPermissionService.hasPermissionObservable.subscribe(
      (hasPermission) => (this.hasPermission = hasPermission)
    );
  }

  edit(): void {
    this.editMode = true;
  }

  save(): void {
    this.menuEmitter.emit({ name: this.name });
    this.editMode = false;
  }
}
