import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ScrollService } from '../../services/scroll.service';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Item, Menu, Section } from '../../interfaces/restaurant-interfaces';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-sectionv2',
  templateUrl: './sectionv2.component.html',
  styleUrls: ['./sectionv2.component.scss'],
})
export class Sectionv2Component implements OnInit {
  faPlus = faPlus;
  editIcon = faPen;
  deleteIcon = faTrash;
  @Input() section: Section;
  @Input() slug: string;
  @Input() menuName: string;
  @Input() hasPermission: boolean;
  @Output() menuEmitter = new EventEmitter<Menu>();
  editMode: boolean;

  constructor(private restaurantService: RestaurantService, private scrollService: ScrollService) {}

  ngOnInit(): void {}

  delete(): void {
    this.restaurantService
      .deleteSection(this.slug, this.menuName, this.section._id)
      .subscribe((menu) => {
        this.menuEmitter.emit(menu);
      });
  }

  editSection(): void {
    this.restaurantService.editSection(this.slug, this.menuName, this.section).subscribe(
      (section) => {
        this.section = section;
      },
      (err) => {
        console.log(err);
      }
    );
    this.editMode = false;
  }

  edit(): void {
    this.editMode = true;
  }

  updateSection(section: Section): void {
    this.section = section;
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

  addMenuItem(): void {
    this.restaurantService.newItem().subscribe((item) => {
      this.section.menu_items.push(item);
      this.restaurantService
        .editSection(this.slug, this.menuName, this.section)
        .subscribe((section) => {
          this.section = section;
          const observer = new MutationObserver((mutations, self) => {
            const newItem = document.getElementById(item._id);
            if (newItem) {
              // find component and then manually set editMode to True
              self.disconnect();
              return;
            }
          });
          observer.observe(document, {
            childList: true,
            subtree: true,
          });
        });
    });
  }
}
