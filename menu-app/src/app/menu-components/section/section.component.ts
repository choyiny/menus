import { Component, Input, OnInit } from '@angular/core';
import { SectionInterface } from '../../interfaces/section-interface';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MenuItemInterface } from '../../interfaces/menu-item-interface';
import { MenuService } from '../../services/menu.service';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit {
  @Input() section: SectionInterface;
  @Input() slug: string;
  editMode;
  @Input() hasPermission: boolean;
  @Input() rearrangeMode: boolean;

  constructor(private menuService: MenuService, private scrollService: ScrollService) {}

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

  addMenuItem(): void {
    this.menuService.addMenuItem(this.slug, this.section._id).subscribe((item) => {
      this.section.menu_items.push(item);
      const observer = new MutationObserver((mutations, self) => {
        const newItem = document.getElementById(item._id);
        if (newItem) {
          this.scrollService.scrollToSection(item._id);
          self.disconnect();
          return;
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true,
      });
    });
  }
}
