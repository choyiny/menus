import { Component, Input, OnInit } from '@angular/core';
import { SectionInterface } from '../../interfaces/section-interface';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit {
  @Input() section: SectionInterface;
  descriptions: string[];

  constructor() {}

  ngOnInit(): void {
    if (this.section.description) {
      this.descriptions = this.section.description.split('^');
    } else {
      this.descriptions = [];
    }
  }
}
