import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { ScrollService } from '../../../services/scroll.service';
import {Menu, Section} from '../../../interfaces/restaurant-interfaces';
import {RestaurantService} from '../../../services/restaurant.service';
import {ManageSectionsComponent} from '../../../control-panel/manage-sections/manage-sections.component';
import { faPlus} from "@fortawesome/pro-solid-svg-icons";

@Component({
  selector: 'app-scrolling-component',
  templateUrl: './scrolling-component.component.html',
  styleUrls: ['./scrolling-component.component.scss'],
})
export class ScrollingComponentComponent implements OnInit {
  @Input() sections: Section[];
  @Input() miniScroll: boolean;
  @Input() currentSection: number;
  @Input() slug: string;
  @Input() menuName: string;
  @Input() hasPermission: boolean;
  @Output() menuEmitter = new EventEmitter<Menu>();
  @ViewChild(ManageSectionsComponent) controlPanel: ManageSectionsComponent;

  // Icons
  addIcon = faPlus;

  constructor(public scrollService: ScrollService, private restaurantService: RestaurantService) {}

  ngOnInit(): void {}

  updateSections(sections: Section[]): void {
    this.restaurantService.editMenu(this.slug, this.menuName, {sections}).subscribe((menu) => {
      this.menuEmitter.emit(menu);
    });
  }

  manageSections(): void {
    this.controlPanel.open();
  }
}
