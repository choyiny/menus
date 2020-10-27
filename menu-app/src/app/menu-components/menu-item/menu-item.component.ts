import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItemInterface } from '../../interfaces/menu-item-interface';
import { MenuService } from '../../services/menu.service';
import { ImgViewModalComponent } from '../../util-components/modals/img-view-modal/img-view-modal.component';
import { ImgFormModalComponent } from '../../util-components/modals/img-form-modal/img-form-modal.component';
import { TagInterface } from '../../interfaces/tag-interface';
import { faPlus, faPen, faTrash, faSave, faImage } from '@fortawesome/free-solid-svg-icons';
import { SectionInterface } from '../../interfaces/section-interface';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {
  @Input() item: MenuItemInterface;
  itemOriginal: MenuItemInterface;
  @ViewChild(ImgViewModalComponent) imgView: ImgViewModalComponent;
  @ViewChild(ImgFormModalComponent) imgForm: ImgFormModalComponent;
  @Input() slug: string;
  @Input() hasPermission: boolean;
  @Output() sectionEmitter = new EventEmitter<SectionInterface>();
  editMode: boolean;
  // icons
  faPlus = faPlus;
  faPen = faPen;
  deleteIcon = faTrash;
  saveIcon = faSave;
  imageIcon = faImage;
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['link']
    ];
  };

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.itemOriginal = { ...this.item };
  }

  showImage(): void {
    this.imgView.open();
  }

  cropImage($event): void {
    this.imgForm.open();
    event.stopPropagation();
  }

  sendRequest(): void {
    this.menuService.editItem(this.slug, this.item).subscribe((item) => {
      this.item = item;
      this.itemOriginal = { ...item };
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
    this.sendRequest();
  }

  updateTags(newValue, index): void {
    if (newValue) {
      this.item.tags[index] = { text: newValue, icon: 'no-icon' };
    } else {
      this.item.tags.splice(index, 1);
    }
    this.sendRequest();
  }

  remove(): void {
    this.menuService.removeMenuItem(this.slug, this.item._id).subscribe((section) => {
      this.sectionEmitter.emit(section);
    });
  }

  delete(): void {
    this.menuService.deleteImage(this.slug, this.item._id).subscribe((item) => {
      this.item = item;
    });
  }

  discard(): void {
    this.editMode = false;
    this.item = { ...this.itemOriginal };
  }

  setImage(url: string): void {
    this.item.image = url;
  }
}
