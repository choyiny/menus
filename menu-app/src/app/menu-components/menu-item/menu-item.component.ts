import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItemInterface } from '../../interfaces/menu-item-interface';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ImgViewModalComponent } from '../../util-components/img-view-modal/img-view-modal.component';
import { ImgFormModalComponent } from '../../util-components/img-form-modal/img-form-modal.component';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {
  @Input() item: MenuItemInterface;
  @ViewChild(ImgViewModalComponent) imgView: ImgViewModalComponent;
  @ViewChild(ImgFormModalComponent) imgForm: ImgFormModalComponent;
  editMode: boolean;
  @Input() slug: string;
  descriptions: string[];
  mockDescriptions: string[];

  constructor(private menuService: MenuService, private auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.currentUserValue;
    // if (user) {
    //   this.editMode = user.is_admin || this.slug in user.menus;
    // } else {
    //   this.editMode = false;
    // }
    this.descriptions = this.item.description.split('^');
    this.mockDescriptions = [...this.descriptions];
  }

  onSubmit(): void {
    const dataUrl = this.imgForm.file;
    if (dataUrl) {
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'image', { type: 'image/png' });
          const formData = new FormData();
          formData.append('file', file);
          this.menuService.uploadPhoto(this.slug, this.item._id, formData).subscribe((url) => {
            this.item.image = url;
          });
        });
    }
  }

  showImage(): void {
    this.imgView.open();
  }

  cropImage(): void {
    this.imgForm.open();
  }

  sendRequest(): void {
    console.log(this.descriptions, this.mockDescriptions);
    this.item.description = this.mockDescriptions.join('^');
    this.menuService.editItem(this.slug, this.item).subscribe((item) => {
      this.item = item;
      this.descriptions = this.item.description.split('^');
      this.mockDescriptions = [...this.descriptions];
    });
    this.editMode = false;
  }
}
