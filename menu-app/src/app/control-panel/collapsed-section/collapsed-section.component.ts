import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  editMode = false;
  @Output() sectionEmitter = new EventEmitter<Section>();
  @Output() editEmitter = new EventEmitter<boolean>();

  // icons
  deleteIcon = faTrash;
  editIcon = faPen;

  constructor() {}

  ngOnInit(): void {}

  save(): void {
    this.sectionEmitter.emit(this.section);
  }

  edit(): void {
    this.editMode = !this.editMode;
  }

  isEditable(): void {
    this.editEmitter.emit(this.editMode);
  }
}
