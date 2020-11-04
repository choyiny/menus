import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MenuService } from '../../services/menu.service';
import { ScrollService } from '../../services/scroll.service';
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import {Item, Section} from '../../interfaces/restaurant-interfaces';
import {RestaurantService} from '../../services/restaurant.service';

@Component({
  selector: 'app-sectionv2',
  templateUrl: './sectionv2.component.html',
  styleUrls: ['./sectionv2.component.scss']
})
export class Sectionv2Component implements OnInit {
  faPlus = faPlus;
  editIcon = faPen;
  @Input() section: Section;
  @Input() slug: string;
  @Input() menuName: string;
  @Input() hasPermission: boolean;
  @Input() rearrangeMode: boolean;
  editMode: boolean;

  constructor(private restaurantService: RestaurantService, private scrollService: ScrollService) {}

  ngOnInit(): void {}

  sendRequest(): void {
    this.restaurantService.editSection(this.slug, this.menuName, this.section).subscribe((section) => {
      console.log(section);
      this.section = section;
    });
    this.editMode = false;
  }

  drop(event: CdkDragDrop<Item[]>): void {
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

  edit(): void {
    this.editMode = true;
  }

  updateSection(section: Section): void {
    this.section = section;
  }

  // addMenuItem(): void {
  //   this.restaurantService.addMenuItem(this.slug, this.section._id).subscribe((item) => {
  //     this.section.menu_items.push(item);
  //     const observer = new MutationObserver((mutations, self) => {
  //       const newItem = document.getElementById(item._id);
  //       if (newItem) {
  //         this.scrollService.scrollToSection(item._id);
  //         self.disconnect();
  //         return;
  //       }
  //     });
  //     observer.observe(document, {
  //       childList: true,
  //       subtree: true,
  //     });
  //   });
  // }
}

