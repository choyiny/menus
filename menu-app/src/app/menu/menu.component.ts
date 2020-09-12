import { Component, OnInit } from '@angular/core';
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

  constructor(
    private menuservice: MenuService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.slug;
    if (id){
      this.getMenu(id);
    }
  }

  getMenu(id: string): void {
    this.menuservice.getMenu(id).subscribe((menu) => {
      this.menu = menu;
    });
  }

  scrollToSection(id: string): void {


    const header = document.getElementById('header');
    const section = document.getElementById(id);
    const headerOffset = header.offsetHeight;
    const sectionPosition = section.getBoundingClientRect().top;
    const offsetPosition = sectionPosition + headerOffset;
    console.log({offsetPosition, headerOffset, sectionPosition} );
    window.scrollTo({
      top: offsetPosition,
    });
  }

}
