import { Component, Input, OnInit } from '@angular/core';
import { Menu, Section } from '../../interfaces/restaurant-interfaces';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {RestaurantService} from '../../services/restaurant.service';

@Component({
  selector: 'app-menuv2',
  templateUrl: './menuv2.component.html',
  styleUrls: ['./menuv2.component.scss'],
})
export class Menuv2Component implements OnInit {
  @Input() hasPermission: boolean;
  @Input() menu: Menu;
  @Input() slug: string;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {}

  newSection(i: number): void {
    this.restaurantService.newSection().subscribe(
      section => {
        this.menu.sections.splice(i + 1, 0, section);
        this.restaurantService.editMenu(this.slug, this.menu.name, {sections: this.menu.sections}).subscribe(
          menu => {
            this.menu = menu;
          }
        );
      }
    );
  }

  update(menu: Menu): void {
    this.menu = menu;
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
