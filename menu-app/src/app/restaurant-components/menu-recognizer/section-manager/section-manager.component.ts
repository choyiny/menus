import { Component, Input, OnInit } from '@angular/core';
import { faCheck, faPencil, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { RestaurantService } from '../../../services/restaurant.service';
import { Item, Section } from '../../../interfaces/restaurant-interfaces';
import { RestaurantPermissionService } from '../../../services/restaurantPermission.service';

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
  slug: string;
  menuName: string;

  constructor(
    private restaurantService: RestaurantService,
    private rPS: RestaurantPermissionService
  ) {}

  ngOnInit(): void {
    this.rPS.getSlug().subscribe((slug) => (this.slug = slug));
    this.rPS.getMenuName().subscribe((menuName) => {
      console.log(menuName);
      this.menuName = menuName;
    });
  }

  addMenuItem(): void {
    this.restaurantService.newItem().subscribe((item) => {
      this.section.menu_items.push(item);
      this.restaurantService
        .editSection(this.slug, this.menuName, this.section)
        .subscribe((section) => {
          this.section = section;
        });
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }
}
