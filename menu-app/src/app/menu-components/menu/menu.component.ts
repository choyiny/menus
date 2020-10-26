import { MenuEditable, MenuInterface } from '../../interfaces/menus-interface';
import { Component, HostListener, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { ActivatedRoute } from '@angular/router';
import { style, animate, transition, trigger } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { CovidModalComponent } from '../../util-components/modals/covid-modal/covid-modal.component';
import { TimeInterface } from '../../interfaces/time-interface';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SectionInterface } from '../../interfaces/section-interface';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [style({ opacity: 0 }), animate(500, style({ opacity: 1 }))]),
      transition(':leave', [animate(500, style({ opacity: 0 }))]),
    ]),
  ],
})
export class MenuComponent implements OnInit {
  @Input() menu: MenuInterface;
  miniScroll = false;
  @Input() selectedSection: string;
  @Input() selectedImage: string;
  rearrangeMode = false;
  editMode: boolean;
  slug: string;

  // true if user has permission to edit this menu
  hasPermission: boolean;

  @ViewChild(CovidModalComponent) covid: CovidModalComponent;
  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params.slug;
    if (this.slug != null) {
      this.getMenu(this.slug);
    }
    const user = this.authService.currentUserValue;
    if (user) {
      this.hasPermission = user.is_admin || user.menus.includes(this.slug);
    } else {
      this.hasPermission = false;
    }
  }

  getMenu(id: string): void {
    this.menuService.getMenu(id).subscribe((menu) => {
      this.menu = menu;
      // force <h1>
      this.menu.description = this.injectHeaderStyle(this.menu.description);
      if (this.sameDay()) {
        return;
      }
      if (this.menu.force_trace) {
        this.covid.open();
        return;
      }
      this.route.queryParams.subscribe((params) => {
        const trace: boolean = params.trace === 'true';
        if (trace && this.menu.enable_trace) {
          this.covid.open();
        }
      });
    });
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
  }

  scrollToSection(id: string): void {
    this.scrollService.scrollToSection(id);
  }

  sendRequest(): void {
    this.menuService.editMenu(this.slug, this.menu).subscribe((menu) => {
      this.menu = menu;
    });
    this.editMode = false;
  }

  edit(): void {
    this.editMode = true;
  }

  injectHeaderStyle(header: string): string {
    return `<h1>${header}</h1>`;
  }

  drop(event: CdkDragDrop<SectionInterface[]>): void {
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

  rearrange(): void {
    this.rearrangeMode = true;
  }

  saveSections(): void {
    const sections = this.menu.sections.map((section) => {
      return {
        _id: section._id,
        description: section.description,
        name: section.name,
        subtitle: section.subtitle,
      };
    });
    this.menuService.rearrangeSections(this.slug, sections).subscribe((menu) => {
      this.menu = menu;
      this.rearrangeMode = false;
    });
  }

  newSection(index): void {
    this.menuService.newSection(this.slug, index).subscribe((menu) => {
      this.menu = menu;
    });
  }

  setValue(editable: MenuEditable): void {
    // tslint:disable-next-line:forin
    for (const field in editable) {
      this.menu[field] = editable[field];
      this.sendRequest();
    }
  }

  sameDay(): boolean {
    if (localStorage.getItem('time_in')) {
      const timeIn: TimeInterface = JSON.parse(localStorage.getItem('time_in'));
      const date = new Date(timeIn.time_in);
      const today = new Date();
      if (
        today.getDay() === date.getDay() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear()
      ) {
        return true;
      }
    } else {
      return false;
    }
  }
}
