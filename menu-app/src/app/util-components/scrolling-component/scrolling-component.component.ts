import { Component, Input, OnInit } from '@angular/core';
import { SectionInterface } from '../../interfaces/section-interface';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-scrolling-component',
  templateUrl: './scrolling-component.component.html',
  styleUrls: ['./scrolling-component.component.scss'],
})
export class ScrollingComponentComponent implements OnInit {
  @Input() sections: SectionInterface[];
  @Input() miniScroll: boolean;

  constructor(public scrollService: ScrollService) {}

  ngOnInit(): void {}
}
