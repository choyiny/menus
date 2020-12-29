import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Item, Menu, Section } from '../../interfaces/restaurant-interfaces';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { RestaurantService } from '../../services/restaurant.service';
import { RestaurantPermissionService } from '../../services/restaurantPermission.service';
import { faPencil } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-menuv2',
  templateUrl: './menuv2.component.html',
  styleUrls: ['./menuv2.component.scss'],
})
export class Menuv2Component implements OnInit {
  // Model
  @Input() menu: Menu;

  // State
  miniScroll = false;
  previousScroll = 0;
  selectedSection = 0;
  editMode: boolean;

  // Globals
  slug: string;
  hasPermission: boolean;

  // Style
  footnoteStyle = {
    color: 'rgba(26, 24, 36, 0.5)',
    margin: '2.5px 0px 2.5px 0px',
  };
  editIcon = faPencil;

  constructor(
    private restaurantService: RestaurantService,
    public restaurantPermissionService: RestaurantPermissionService
  ) {}

  ngOnInit(): void {
    this.restaurantPermissionService.slugObservable.subscribe((slug) => (this.slug = slug));
    this.restaurantPermissionService.hasPermissionObservable.subscribe(
      (hasPermission) => (this.hasPermission = hasPermission)
    );
  }

  updateSections(sections: Section[]): void {
    this.menu.sections = sections;
    this.restaurantService.editMenu(this.slug, this.menu.name, this.menu).subscribe((menu) => {
      this.menu = menu;
    });
  }

  getSectionLists(): string[] {
    return this.menu.sections.map((section) => 'd-list-' + section._id);
  }

  newSection(i: number): void {
    this.restaurantService.newSection().subscribe((section) => {
      this.menu.sections.splice(i + 1, 0, section);
      this.restaurantService
        .editMenu(this.slug, this.menu.name, { sections: this.menu.sections })
        .subscribe((menu) => {
          this.menu = menu;
        });
    });
  }

  update(menu: Menu): void {
    this.menu = menu;
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
    if (this.menu && window.innerWidth < 600) {
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

  saveSections(): void {
    this.restaurantService
      .editMenu(this.slug, this.menu.name, { sections: this.menu.sections })
      .subscribe((menu) => {
        this.menu = menu;
      });
  }

  updateMenu(menu: Menu): void {
    this.menu = menu;
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  saveFootnote(): void {
    const menuEditable = { footnote: this.menu.footnote };
    this.restaurantService.editMenu(this.slug, this.menu.name, menuEditable).subscribe((menu) => {
      this.menu = menu;
      this.toggleEditMode();
    });
  }

  drop(event: CdkDragDrop<Item[]>): void {
    const sectionId1 = event.previousContainer.id.slice('d-list-'.length);
    const sectionId2 = event.container.id.slice('d-list-'.length);
    if (event.previousContainer.id === event.container.id) {
      const section = this.menu.sections.find(
        (currentSection) => currentSection._id === sectionId1
      );
      moveItemInArray(section.menu_items, event.previousIndex, event.currentIndex);
    } else {
      const section1 = this.menu.sections.find((section) => section._id === sectionId1);
      const section2 = this.menu.sections.find((section) => section._id === sectionId2);
      transferArrayItem(
        section1.menu_items,
        section2.menu_items,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.saveSections();
  }

  get dropFunc(): any {
    return this.drop.bind(this);
  }
}
