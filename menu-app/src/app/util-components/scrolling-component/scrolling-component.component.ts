import { Component, Input, OnInit } from '@angular/core';
import { SectionInterface } from '../../interfaces/section-interface';
import { ScrollService } from '../../services/scroll.service';
import {Section} from "../../interfaces/restaurant-interfaces";

@Component({
  selector: 'app-scrolling-component',
  templateUrl: './scrolling-component.component.html',
  styleUrls: ['./scrolling-component.component.scss'],
})
export class ScrollingComponentComponent implements OnInit {
  @Input() sections: Section [];
  @Input() miniScroll: boolean;
  @Input() currentSection: number;

  constructor(public scrollService: ScrollService) {}

  ngOnInit(): void {
    console.log(this.sections);
  }
}
