import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Section} from "../../interfaces/restaurant-interfaces";

@Component({
  selector: 'app-collapsed-section',
  templateUrl: './collapsed-section.component.html',
  styleUrls: ['./collapsed-section.component.scss']
})
export class CollapsedSectionComponent implements OnInit {

  @Input() section: Section;
  @Input() index: number;
  sectionEmitter = new EventEmitter<Section>();
  constructor() { }

  ngOnInit(): void {
  }

  save(): void {
    this.sectionEmitter.emit(this.section);
  }

}
