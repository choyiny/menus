import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Section } from '../../interfaces/restaurant-interfaces';
import { faTrash, faPen} from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-collapsed-section',
  templateUrl: './collapsed-section.component.html',
  styleUrls: ['./collapsed-section.component.scss'],
})
export class CollapsedSectionComponent implements OnInit {
  @Input() section: Section;
  @Input() index: number;
  editMode: boolean;
  sectionEmitter = new EventEmitter<Section>();

  // icons
  deleteIcon = faTrash;
  editIcon = faPen;

  constructor() {}

  ngOnInit(): void {}

  save(): void {
    this.sectionEmitter.emit(this.section);
  }
}
