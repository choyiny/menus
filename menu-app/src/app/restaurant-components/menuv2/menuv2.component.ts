import {Component, HostListener, Input, OnInit} from '@angular/core';
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
  miniScroll = false;
  previousScroll = 0;
  selectedSection = 0;

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

  @HostListener('window:scroll', ['$event'])
  checkScroll(): void {
    const scrollPosition = window.pageYOffset;
    let transitionConstant: number;
    if (window.innerWidth > 600) {
      transitionConstant = 0;
    } else {
      transitionConstant = 300;
    }
    if (scrollPosition > transitionConstant) {
      this.miniScroll = true;
    } else {
      this.miniScroll = false;
    }

    // linear time solution, if performance is an issue, should switch to using pointers
    if (this.menu) {
      if (scrollPosition > this.previousScroll) {
        for (let i = 0; i < this.menu.sections.length; i++) {
          const sectionPosition = document.getElementById(this.menu.sections[i]._id).offsetTop;
          if (scrollPosition < sectionPosition) {
            this.selectedSection = i;
            break;
          }
        }
      } else {
        for (let i = this.menu.sections.length - 1; i >= 0; i--) {
          const sectionPosition = document.getElementById(this.menu.sections[i]._id).offsetTop;
          if (sectionPosition < scrollPosition) {
            this.selectedSection = i;
            break;
          }
        }
      }
      const buttonLocation = document.getElementById(
        `${this.menu.sections[this.selectedSection]._id} button`
      ).offsetLeft;
      document.getElementById('wrapper').scrollTo({
        behavior: 'smooth',
        left: buttonLocation,
      });

      this.previousScroll = scrollPosition;
    }
  }
}
