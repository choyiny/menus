import { Component, OnInit } from '@angular/core';
import {
  faAngleLeft,
  faAngleRight, faCheck,
  faPencil,
  faPlus,
  faReply,
  faTrash,
  faUpload
} from "@fortawesome/pro-solid-svg-icons";
import {RestaurantPermissionService} from "../../../services/restaurantPermission.service";
import {RestaurantService} from "../../../services/restaurant.service";
import {ActivatedRoute} from "@angular/router";
import {Item} from "../../../interfaces/restaurant-interfaces";

@Component({
  selector: 'app-section-manager',
  templateUrl: './section-manager.component.html',
  styleUrls: ['./section-manager.component.scss']
})
export class SectionManagerComponent implements OnInit {

  plusIcon = faPlus;
  checkIcon = faCheck;

  item: Item;

  constructor(
    private restaurantService: RestaurantService,
  ) {}

  ngOnInit(): void {
  }

  // Menu logic
  addMenuItem(): void {
    this.restaurantService.newItem().subscribe(item => this.item = item);
  }

}
