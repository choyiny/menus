import { Component, HostListener, OnInit } from '@angular/core';
import { MenuInterface } from '../interfaces/MenuInterface';
import { MenuService } from '../services/menu.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menu: MenuInterface;
  showImage = true;

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

    if (scrollPosition >= 150) {
      this.showImage = false;
    } else {
      this.showImage = true;
    }
  }

  scrollToSection(id: string): void {
    const headerOffset = document.getElementById('header').offsetHeight;
    const topOfElement = document.getElementById(id).getBoundingClientRect().top - headerOffset;
    window.scroll({ top: topOfElement});
  }
}
