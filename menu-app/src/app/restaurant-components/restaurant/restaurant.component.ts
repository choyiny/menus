
import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Menu, Restaurant, RestaurantEditable} from '../../interfaces/restaurant-interfaces';
import {CovidModalComponent} from '../../util-components/modals/covid-modal/covid-modal.component';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ScrollService} from '../../services/scroll.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {SectionInterface} from '../../interfaces/section-interface';
import {TimeInterface} from '../../interfaces/time-interface';
import {RestaurantService} from '../../services/restaurant.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  @Input()restaurant: Restaurant;
  menus = [];
  menu: Menu;
  miniScroll = false;
  selectedSection = 0;
  @Input() selectedImage: string;
  rearrangeMode = false;
  slug: string;
  previousScroll = 0;

  // true if user has permission to edit this menuv2
  hasPermission: boolean;

  @ViewChild(CovidModalComponent) covid: CovidModalComponent;
  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params.slug;
    if (this.slug != null) {
      this.getRestaurant();
    }
    const user = this.authService.currentUserValue;
    if (user) {
      this.hasPermission = user.is_admin || user.menus.includes(this.slug);
    } else {
      this.hasPermission = false;
    }
  }

  loadMenus(): void {
    for (let i = 0; i < this.restaurant.menus.length; i++){
      const menuName = this.restaurant.menus[i];
      this.restaurantService.getMenus(this.slug, menuName).subscribe(
        menu => {
          this.menus[i] = menu;
        }
      );
    }
  }

  getRestaurant(): void {
    this.restaurantService.getRestaurant(this.slug).subscribe((restaurant) => {
      this.restaurant = restaurant;
      this.loadMenus();
      // force <h1>
      this.restaurant.description = this.injectHeaderStyle(this.restaurant.description);
      if (this.sameDay()) {
        return;
      }
      if (this.restaurant.force_trace) {
        this.covid.open();
        return;
      }
      this.route.queryParams.subscribe((params) => {
        const trace: boolean = params.trace === 'true';
        if (trace && this.restaurant.enable_trace) {
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

    // linear time solution, if performance is an issue, should switch to using pointers
    // if (scrollPosition > this.previousScroll) {
    //   for (let i = 0; i < this.menuv2.sections.length; i++) {
    //     const sectionPosition = document.getElementById(this.menuv2.sections[i]._id).offsetTop;
    //     if (scrollPosition < sectionPosition) {
    //       this.selectedSection = i;
    //       break;
    //     }
    //   }
    // } else {
    //   for (let i = this.menuv2.sections.length - 1; i >= 0; i--) {
    //     const sectionPosition = document.getElementById(this.menuv2.sections[i]._id).offsetTop;
    //     if (sectionPosition < scrollPosition) {
    //       this.selectedSection = i;
    //       break;
    //     }
    //   }
    // }
    // const buttonLocation = document.getElementById(
    //   `${this.menuv2.sections[this.selectedSection]._id} button`
    // ).offsetLeft;
    // document.getElementById('wrapper').scrollTo({
    //   behavior: 'smooth',
    //   left: buttonLocation,
    // });
    //
    // this.previousScroll = scrollPosition;
  }

  scrollToSection(id: string): void {
    this.scrollService.scrollToSection(id);
  }

  injectHeaderStyle(header: string): string {
    if (header.slice(0, 4) === '<h1>'){
      return header;
    }
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
    // this.restaurantService.rearrangeSections(this.slug, sections).subscribe((menuv2) => {
    //   this.menuv2 = menuv2;
    //   this.rearrangeMode = false;
    // });
  }

  // newSection(index): void {
  //   this.restaurantService.newSection(this.slug, index).subscribe((menuv2) => {
  //     this.menuv2 = menuv2;
  //   });
  // }

  setValue(editable: RestaurantEditable): void {
    // tslint:disable-next-line:forin
    for (const field in editable) {
      this.restaurant[field] = editable[field];
      this.restaurantService.editRestaurant(this.slug, editable);
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



