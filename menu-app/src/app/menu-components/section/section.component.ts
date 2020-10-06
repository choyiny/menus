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
  descriptions: string[];
  editMode;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.descriptions = this.section.description.split('^');
  }

  sendRequest(): void {
    this.section.description = this.descriptions.join('^');
    console.log(this.section.description);
    this.menuService.editSection(this.slug, this.section).subscribe((section) => {
      this.section = section;
      this.descriptions = this.section.description.split('^');
      console.log(this.section);
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
}
