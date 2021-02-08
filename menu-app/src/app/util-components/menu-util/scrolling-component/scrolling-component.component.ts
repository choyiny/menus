import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ScrollService } from '../../../services/scroll.service';
import { Menu, Section } from '../../../interfaces/restaurant-interfaces';
import { RestaurantService } from '../../../services/restaurant.service';
import { ManageSectionsComponent } from '../../../control-panel/manage-sections/manage-sections.component';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { RestaurantPermissionService } from '../../../services/restaurantPermission.service';

@Component({
  selector: 'app-scrolling-component',
  templateUrl: './scrolling-component.component.html',
  styleUrls: ['./scrolling-component.component.scss'],
})
export class ScrollingComponentComponent implements OnInit {
  @Input() sections: Section[];
  @Input() miniScroll: boolean;
  @Input() currentSection: number;
  @Output() sectionEmitter = new EventEmitter<Section[]>();
  @ViewChild(ManageSectionsComponent) controlPanel: ManageSectionsComponent;

  // Icons
  addIcon = faPlus;

  slug: string;
  menuName: string;
  hasPermission: boolean;

  constructor(
    public scrollService: ScrollService,
    private restaurantService: RestaurantService,
    private restaurantPermissionService: RestaurantPermissionService
  ) {}

  ngOnInit(): void {
    this.restaurantPermissionService.slugObservable.subscribe((slug) => (this.slug = slug));
    this.restaurantPermissionService.menuNameObservable.subscribe(
      (menuName) => (this.menuName = menuName)
    );
    this.restaurantPermissionService.hasPermissionObservable.subscribe(
      (hasPermission) => (this.hasPermission = hasPermission)
    );
  }

  updateSections(sections: Section[]): void {
    this.sectionEmitter.emit(sections);
  }

  manageSections(): void {
    this.controlPanel.open();
  }
}
