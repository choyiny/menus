import {Component, HostListener, Input, OnInit, AfterViewChecked} from '@angular/core';
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
export class MenuComponent implements OnInit, AfterViewChecked{
  menu: MenuInterface;
  showImage = true;
  @Input()selectedSection: string;
  // blockChange = false;
  // willScroll = false;
  // scrollToId;

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
    if (scrollPosition > 0) {
      this.showImage = false;
    } else {
      this.showImage = true;
    }
  }

  scrollToSection(id: string): void {
    if (window.scrollY === 0){
      window.scrollTo(0, document.body.scrollHeight);
    }
    this.selectedSection = id;
    document.getElementById(id).scrollIntoView();
    const height = window.scrollY;
    const headerHeight = document.getElementById('header').offsetHeight;
    console.log({height, headerHeight});
    if (height){
      window.scroll(0, height + headerHeight);
    }
  }

  ngAfterViewChecked(): void {
    // if (this.willScroll){
    //   const headerSize = document.getElementById('header').offsetHeight;
    //   document.get
    // }
  }
}
