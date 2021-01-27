import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Section } from '../../interfaces/restaurant-interfaces';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { RestaurantService } from '../../services/restaurant.service';
import { RestaurantPermissionService } from '../../services/restaurantPermission.service';

@Component({
  selector: 'app-manage-sections',
  templateUrl: './manage-sections.component.html',
  styleUrls: ['./manage-sections.component.scss'],
})
export class ManageSectionsComponent implements OnInit {
  @ViewChild('section') modal;
  @Input() sections: Section[];
  originalSections: Section[];
  @Output() sectionEmitter = new EventEmitter<Section[]>();

  // icons
  addIcon = faPlus;
  slug: string;
  menuName: string;

  constructor(
    private modalService: NgbModal,
    private restaurantService: RestaurantService,
    private restaurantPermissionService: RestaurantPermissionService
  ) {}

  parse(sections: Section[]): Section[] {
    return JSON.parse(JSON.stringify(sections));
  }

  ngOnInit(): void {
    this.originalSections = this.parse(this.sections);
    this.restaurantPermissionService.getSlug().subscribe((slug) => {
      this.slug = slug;
    });
    this.restaurantPermissionService.getMenuName().subscribe((menuName) => {
      this.menuName = menuName;
    });
  }

  open(): void {
    this.restaurantService.getMenus(this.slug, this.menuName).subscribe((menu) => {
      this.originalSections = menu.sections;
    });
    this.modalService.open(this.modal);
  }

  save(modal): void {
    this.sectionEmitter.emit(this.originalSections);
    this.sections = this.parse(this.originalSections);
    this.originalSections = this.parse(this.sections);
    modal.close();
  }

  newSection(): void {
    this.restaurantService.newSection().subscribe((section) => {
      this.originalSections.push(section);
    });
  }

  deleteSection(i): void {
    this.originalSections.splice(i, 1);
  }

  cancel(modal): void {
    this.originalSections = this.parse(this.sections);
    modal.close();
  }

  drop(event: CdkDragDrop<Section[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
