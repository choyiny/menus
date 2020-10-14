import { Component, OnInit } from '@angular/core';
import { SlugInterface } from '../../interfaces/menus-interface';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-menu-dashboard',
  templateUrl: './menu-dashboard.component.html',
  styleUrls: ['./menu-dashboard.component.scss'],
})
export class MenuDashboardComponent implements OnInit {
  constructor(private router: Router, private menuService: MenuService) {
    // does not work on ngOnInit
    const state = this.router.getCurrentNavigation().extras.state;
    if (state) {
      this.menuInfo = state.menu;
      sessionStorage.setItem('currentMenu', JSON.stringify(this.menuInfo));
    } else if (sessionStorage.getItem('currentMenu') !== null) {
      // cache value in cookies
      this.menuInfo = JSON.parse(sessionStorage.getItem('currentMenu'));
    }
  }

  menuInfo: SlugInterface;
  file: File;
  baseUrl;

  ngOnInit(): void {
    this.baseUrl = window.location.origin;
  }

  onChange(event): void {
    this.file = event.target.files[0];
  }

  importCsv(): void {
    const formData = new FormData();
    formData.append('file', this.file);
    this.menuService.uploadCsv(this.menuInfo.slug, formData).subscribe((menu) => {});
  }

  deleteMenu(): void {
    this.menuService.deleteMenu(this.menuInfo.slug).subscribe((menu) => {});
  }

  generateQr(): void {
    this.menuService
      .generateQR({
        url: `${this.baseUrl}$/menu/${this.menuInfo.slug}`,
        name: this.menuInfo.name,
      })
      .subscribe((blob) => {
        const fileName = `${this.menuInfo.name}.${blob.type}`;
        FileSaver.saveAs(blob, fileName);
      });
  }
}
