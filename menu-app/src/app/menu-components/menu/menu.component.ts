import { Component, HostListener, Input, OnInit, AfterViewChecked } from '@angular/core';
import { MenuInterface } from '../../interfaces/menu-interface';
import { MenuService } from '../../services/menu.service';
import { ActivatedRoute } from '@angular/router';
import { style, animate, transition, trigger } from '@angular/animations';
import { FormBuilder, FormControl } from '@angular/forms';

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

  constructor(private menuservice: MenuService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params.slug;
    if (this.slug) {
      this.getMenu(this.slug);
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
    const offsetPosition = elementPosition - headerOffset;
    document.documentElement.scrollTop = offsetPosition;
    document.body.scrollTop = offsetPosition;
  }

  sendRequest(): void {
    this.menuservice.editMenu(this.slug, this.menu).subscribe((menu) => (this.menu = menu));
    this.editMode = false;
  }

  edit(): void {
    this.editMode = true;
  }
}
