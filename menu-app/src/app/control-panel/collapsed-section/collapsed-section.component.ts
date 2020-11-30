import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Section } from '../../interfaces/restaurant-interfaces';
import { faTrash, faPen, faArrowsAlt } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-collapsed-section',
  templateUrl: './collapsed-section.component.html',
  styleUrls: ['./collapsed-section.component.scss'],
})
export class CollapsedSectionComponent implements OnInit {
  @Input() section: Section;
  @Input() index: number;

  @Output() indexEmitter = new EventEmitter<number>();

  editMode = false;
  sectionOriginal: Section;

  // icons
  deleteIcon = faTrash;
  editIcon = faPen;
  dragIcon = faArrowsAlt;

  constructor() {}

  ngOnInit(): void {
  }

  parse(section: Section): Section {
    return (this.sectionOriginal = JSON.parse(JSON.stringify(section)));
  }

  save(): void {
    this.editMode = false;
  }

  edit(): void {
    this.editMode = !this.editMode;
    this.sectionOriginal = this.parse(this.section);
  }

  delete(): void {
    this.indexEmitter.emit(this.index);
  }

  cancel(): void {
    this.section = this.parse(this.sectionOriginal);
    this.editMode = false;
  }
}
