import { Component, Input, OnInit } from '@angular/core';
import { SectionInterface } from '../../interfaces/section-interface';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MenuItemInterface } from '../../interfaces/menu-item-interface';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit {
  @Input() section: SectionInterface;
  @Input() slug: string;
  editMode;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {}

  sendRequest(): void {
    this.menuService.editSection(this.slug, this.section).subscribe((section) => {
      console.log(section);
      this.section = section;
    });
    this.editMode = false;
  }

  drop(event: CdkDragDrop<MenuItemInterface[]>): void {
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
}
