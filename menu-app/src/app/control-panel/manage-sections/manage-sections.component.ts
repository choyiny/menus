import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Section } from '../../interfaces/restaurant-interfaces';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { faPlus} from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-manage-sections',
  templateUrl: './manage-sections.component.html',
  styleUrls: ['./manage-sections.component.scss'],
})
export class ManageSectionsComponent implements OnInit {
  @ViewChild('section') modal;
  @Input() sections: Section[];
  @Output() sectionEmitter = new EventEmitter<Section[]>();

  // icons
  addIcon = faPlus;
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  open(): void {
    this.modalService.open(this.modal);
  }

  save(modal): void {
    this.sectionEmitter.emit(this.sections);
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
