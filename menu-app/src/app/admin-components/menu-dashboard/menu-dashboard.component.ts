import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import * as FileSaver from 'file-saver';
import { MenuInterface } from '../../interfaces/menus-interface';

@Component({
  selector: 'app-menu-dashboard',
  templateUrl: './menu-dashboard.component.html',
  styleUrls: ['./menu-dashboard.component.scss'],
})
export class MenuDashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private menuService: MenuService,
    private route: ActivatedRoute
  ) {}

  menu: MenuInterface;
  file: File;
  baseUrl;
  slug: string;

  ngOnInit(): void {
    this.slug = this.route.snapshot.params.slug;
    if (this.slug != null) {
      this.menuService.getMenu(this.slug).subscribe((menu) => {
        this.menu = menu;
      });
    }
    this.baseUrl = window.location.origin;
  }

  onChange(event): void {
    this.file = event.target.files[0];
  }

  importCsv(): void {
    const formData = new FormData();
    formData.append('file', this.file);
    this.menuService.uploadCsv(this.slug, formData).subscribe((menu) => {});
  }

  appendCsv(): void {
    const formData = new FormData();
    formData.append('file', this.file);
    this.menuService.appendCsv(this.slug, formData).subscribe((menu) => {});
  }

  deleteMenu(): void {
    this.menuService.deleteMenu(this.slug).subscribe((menu) => {});
  }

  generateQr(): void {
    this.menuService
      .generateQR({
        url: `${this.baseUrl}/menu/${this.slug}`,
        name: this.menu.name,
      })
      .subscribe((blob) => {
        const fileName = `${this.menu.name}.${blob.type}`;
        FileSaver.saveAs(blob, fileName);
      });
  }
}
