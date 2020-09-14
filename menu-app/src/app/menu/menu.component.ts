import {Component, HostListener, Input, OnInit} from '@angular/core';
import { MenuInterface } from '../interfaces/MenuInterface';
import { MenuService } from '../services/menu.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {style, state, animate, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({opacity: 0}),
        animate(500, style({opacity: 1}))
      ]),
      transition(':leave', [
        animate(500, style({opacity: 0}))
      ])
    ])
  ]
})
export class MenuComponent implements OnInit {
  menu: MenuInterface;
  showImage = true;
  @Input()selectedSection: string;

  constructor(private menuservice: MenuService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.slug;
    if (id) {
      this.getMenu(id);
    }
  }

  getMenu(id: string): void {
    this.menuservice.getMenu(id).subscribe((menu) => {
      this.menu = menu;
    });
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll(): void {
    const scrollPosition = window.pageYOffset;

    if (scrollPosition >= 15) {
      this.showImage = false;
    } else {
      this.showImage = true;
    }
  }

  scrollToSection(id: string): void {
    window.scroll({top: 0});
    const headerOffset = document.getElementById('header').offsetHeight;
    const topOfElement = document.getElementById(id).getBoundingClientRect().top - headerOffset;
    console.log(topOfElement);
    window.scroll({ top: topOfElement});
    this.selectedSection = id;
    console.log(this.selectedSection);
  }

}
