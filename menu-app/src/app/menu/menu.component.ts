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

  constructor(
    private menuservice: MenuService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.slug;
    this.getMenu(id);
  }

  getMenu(id: string): void {
    this.menuservice.getMenu(id).subscribe((menu) => {
      this.menu = menu;
    });
  }

  scrollToSection(id: string): void {
    console.log(id);
    document.getElementById(id).scrollIntoView();
  }
}
