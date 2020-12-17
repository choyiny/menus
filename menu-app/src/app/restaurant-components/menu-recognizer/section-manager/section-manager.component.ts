import { Component, Input, OnInit } from '@angular/core';
import { faCheck, faPencil, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { RestaurantService } from '../../../services/restaurant.service';
import { Item, Section } from '../../../interfaces/restaurant-interfaces';

@Component({
  selector: 'app-section-manager',
  templateUrl: './section-manager.component.html',
  styleUrls: ['./section-manager.component.scss'],
})
export class SectionManagerComponent implements OnInit {
  plusIcon = faPlus;
  checkIcon = faCheck;
  editIcon = faPencil;

  @Input() section: Section;

  // State
  editMode = false;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {}

  addMenuItem(): void {
    this.restaurantService.newItem().subscribe((item) => {
      this.section.menu_items.push(item);
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }
}
