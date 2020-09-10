import { Component, OnInit } from '@angular/core';
import { MenuInterface } from '../interfaces/MenuInterface';
import { MenuService } from '../services/menu.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      console.log(params.get('menu'));
      console.log(params);
      this.getMenu('hollywood');
    });

    const id = this.route.snapshot.params.slug;
    console.log(this.router.url);
    console.log(id);
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
