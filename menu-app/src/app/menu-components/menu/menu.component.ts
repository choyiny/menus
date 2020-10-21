import { MenuInterface } from '../../interfaces/menus-interface';
import { Component, HostListener, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { ActivatedRoute } from '@angular/router';
import { style, animate, transition, trigger } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { CovidModalComponent } from '../../util-components/covid-modal/covid-modal.component';
import { TimeInterface } from '../../interfaces/time-interface';

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
  showImage = true;
  @Input() selectedSection: string;
  @Input() selectedImage: string;
  editMode: boolean;
  slug: string;
  hasPermission: boolean;

  @ViewChild(CovidModalComponent) covid: CovidModalComponent;
  constructor(
    private menuservice: MenuService,
    private route: ActivatedRoute,
    private authService: AuthService
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
    this.menuservice.getMenu(id).subscribe((menu) => {
      this.menu = menu;
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
      this.showImage = false;
    } else {
      this.showImage = true;
    }
  }

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    const headerOffset = document.getElementById('wrapper').offsetHeight;
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - headerOffset;
    document.documentElement.scrollTop = offsetPosition;
    document.body.scrollTop = offsetPosition;
  }

  sendRequest(): void {
    this.menuservice.editMenu(this.slug, this.menu).subscribe((menu) => {
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
