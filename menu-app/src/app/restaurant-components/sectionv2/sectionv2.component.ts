import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faPlus, faPen, faTrash, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { Item, Menu, Section } from '../../interfaces/restaurant-interfaces';
import { RestaurantService } from '../../services/restaurant.service';
import { RestaurantPermissionService } from '../../services/restaurantPermission.service';

@Component({
  selector: 'app-sectionv2',
  templateUrl: './sectionv2.component.html',
  styleUrls: ['./sectionv2.component.scss'],
})
export class Sectionv2Component implements OnInit {
  faPlus = faPlus;
  editIcon = faPen;
  deleteIcon = faTrash;
  faGrip = faArrowsAlt;
  @Input() section: Section;
  @Input() sectionLists: string[];
  @Input() drop;
  @Input() item: Item;
  @Output() menuEmitter = new EventEmitter<Menu>();
  @Output() saveSectionEmitter = new EventEmitter<Section>();
  editMode: boolean;

  slug: string;
  hasPermission: boolean;
  menuName: string;

  constructor(
    private restaurantService: RestaurantService,
    public restaurantPermissionService: RestaurantPermissionService
  ) {}

  ngOnInit(): void {
    this.restaurantPermissionService.slugObservable.subscribe((slug) => (this.slug = slug));
    this.restaurantPermissionService.hasPermissionObservable.subscribe(
      (hasPermission) => (this.hasPermission = hasPermission)
    );
    this.restaurantPermissionService.menuNameObservable.subscribe(
      (menuName) => (this.menuName = menuName)
    );
  }

  editSection(): void {
    this.saveSectionEmitter.emit(this.section);
    this.editMode = false;
  }

  edit(): void {
    this.editMode = true;
  }

  updateSection(section: Section): void {
    this.section = section;
    this.saveSectionEmitter.emit(this.section);
  }

  deleteItem(item: Item): void {
    for (let j = 0; j < this.section.menu_items.length; j++) {
      if (this.section.menu_items[j]._id === item._id) {
        this.section.menu_items.splice(j, 1);
        this.saveSectionEmitter.emit();
        return;
      }
    }
  }

  addMenuItem(): void {
    this.restaurantService.newItem().subscribe((item) => {
      this.section.menu_items.push(item);
      this.saveSectionEmitter.emit(this.section);
      const observer = new MutationObserver((mutations, self) => {
        const newItem = document.getElementById(item._id);
        if (newItem) {
          // find component and then manually set editMode to True
          self.disconnect();
          return;
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true,
      });
    });
  }
}
