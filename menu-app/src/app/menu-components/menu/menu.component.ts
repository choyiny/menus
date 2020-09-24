import { Component, HostListener, Input, OnInit, AfterViewChecked } from '@angular/core';
import { MenuInterface } from '../../interfaces/menu-interface';
import { MenuService } from '../../services/menu.service';
import { ActivatedRoute } from '@angular/router';
import { style, animate, transition, trigger } from '@angular/animations';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

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
  menu: MenuInterface;
  showImage = true;
  @Input() selectedSection: string;
  @Input() desktopMode: boolean;

  constructor(
    private menuservice: MenuService,
    private route: ActivatedRoute,
    public breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.slug;
    if (id) {
      this.getMenu(id);
    }

    this.breakpointObserver.observe(['(min-width: 600px)']).subscribe((mode: BreakpointState) => {
      if (mode.matches) {
        this.desktopMode = true;
      } else {
        this.desktopMode = false;
      }
    });
  }

  getMenu(id: string): void {
    this.menuservice.getMenu(id).subscribe((menu) => {
      this.menu = menu;
    });
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll(): void {
    const scrollPosition = window.pageYOffset;
    if (scrollPosition > 300) {
      this.showImage = false;
    } else {
      this.showImage = true;
    }
  }

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    const headerOffset = document.getElementById('wrapper').offsetHeight;
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - 2.5 * headerOffset;
    console.log({ headerOffset, offsetPosition, elementPosition });
    document.documentElement.scrollTop = offsetPosition;
    document.body.scrollTop = offsetPosition;
  }
}
