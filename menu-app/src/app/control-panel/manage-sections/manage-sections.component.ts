import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Section } from '../../interfaces/restaurant-interfaces';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { RestaurantService } from '../../services/restaurant.service';

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

  constructor(private modalService: NgbModal, private restaurantService: RestaurantService) {}

  parse(sections: Section[]): Section[] {
    return JSON.parse(JSON.stringify(sections));
  }

  ngOnInit(): void {
    this.originalSections = this.parse(this.sections);
  }

  open(): void {
    this.modalService.open(this.modal);
  }

  save(modal): void {
    this.sectionEmitter.emit(this.originalSections);
    modal.close();
  }

  newSection(): void {
    this.restaurantService.newSection().subscribe((section) => {
      this.sections.push(section);
    });
  }

  deleteSection(i): void {
    this.originalSections.splice(i, 1);
    console.log(this.originalSections.length);
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
