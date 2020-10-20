import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItemInterface } from '../../interfaces/menu-item-interface';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { ImgViewModalComponent } from '../../util-components/img-view-modal/img-view-modal.component';
import { ImgFormModalComponent } from '../../util-components/img-form-modal/img-form-modal.component';
import { TagInterface } from '../../interfaces/tag-interface';

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
  @Input() hasPermission: boolean;
  editableTags: TagInterface[];
  editable = false;

  constructor(private menuService: MenuService, private auth: AuthService) {}

  ngOnInit(): void {
    this.editableTags = this.item.tags;
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
    this.menuService.editItem(this.slug, this.item).subscribe((item) => {
      this.item = item;
    });
    this.editMode = false;
  }

  edit(): void {
    this.editMode = true;
  }

  addTag(): void {
    const newTag: TagInterface = {
      text: 'New tag',
      icon: 'no-icon',
    };
    this.item.tags.push(newTag);
  }

  editTag(): void {
    this.editable = true;
  }

  updateTags(newValue, index): void {
    this.item.tags[index] = { text: newValue, icon: 'no-icon' };
    this.editable = false;
  }
}
