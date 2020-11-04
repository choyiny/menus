import { Component, Input, OnInit } from '@angular/core';
import { Menu, Section } from '../../interfaces/restaurant-interfaces';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SectionInterface } from '../../interfaces/section-interface';

@Component({
  selector: 'app-menuv2',
  templateUrl: './menuv2.component.html',
  styleUrls: ['./menuv2.component.scss'],
})
export class Menuv2Component implements OnInit {
  @Input() hasPermission: boolean;
  @Input() menu: Menu;
  @Input() slug: string;
  @Input() menuName: string;

  constructor() {}

  ngOnInit(): void {}

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
