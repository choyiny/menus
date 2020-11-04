import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItemInterface } from '../../interfaces/menu-item-interface';
import { MenuService } from '../../services/menu.service';
import { ImgViewModalComponent } from '../../util-components/modals/img-view-modal/img-view-modal.component';
import { ImgFormModalComponent } from '../../util-components/modals/img-form-modal/img-form-modal.component';
import { TagInterface } from '../../interfaces/tag-interface';
import { faPlus, faPen, faTrash, faSave, faImage } from '@fortawesome/free-solid-svg-icons';
import { SectionInterface } from '../../interfaces/section-interface';
import {Item} from '../../interfaces/restaurant-interfaces';
import {RestaurantService} from '../../services/restaurant.service';

@Component({
  selector: 'app-itemv2',
  templateUrl: './itemv2.component.html',
  styleUrls: ['./itemv2.component.scss']
})
export class Itemv2Component implements OnInit {
  @Input() item: Item;
  itemOriginal: Item;
  @ViewChild(ImgViewModalComponent) imgView: ImgViewModalComponent;
  @ViewChild(ImgFormModalComponent) imgForm: ImgFormModalComponent;
  @Input() slug: string;
  @Input() menuName: string;
  @Input() hasPermission: boolean;
  @Output() sectionEmitter = new EventEmitter<SectionInterface>();
  editMode: boolean;
  // icons
  faPlus = faPlus;
  faPen = faPen;
  deleteIcon = faTrash;
  saveIcon = faSave;
  imageIcon = faImage;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.itemOriginal = { ...this.item };
  }

  get imageUrl(): string {
    if (this.hasPermission) {
      return this.item.image ? this.item.image : 'assets/add_photos.png';
    } else {
      return this.item.image;
    }
  }

  showImage(): void {
    this.imgView.open();
  }

  cropImage($event): void {
    this.imgForm.open();
    event.stopPropagation();
  }

  sendRequest(): void {
    this.restaurantService.editItem(this.slug, this.menuName, this.item).subscribe((item) => {
      this.item = item;
      this.itemOriginal = { ...item };
    });
    this.editMode = false;
  }

  edit(): void {
    this.editMode = true;
  }

  // addTag(): void {
  //   const newTag: TagInterface = {
  //     text: 'New tag',
  //     icon: 'no-icon',
  //   };
  //   this.item.tags.push(newTag);
  //   this.sendRequest();
  // }
  //
  // updateTags(newValue, index): void {
  //   if (newValue) {
  //     this.item.tags[index] = { text: newValue, icon: 'no-icon' };
  //   } else {
  //     this.item.tags.splice(index, 1);
  //   }
  //   this.sendRequest();
  // }
  //
  // remove(): void {
  //   this.restaurantService.removeMenuItem(this.slug, this.item._id).subscribe((section) => {
  //     this.sectionEmitter.emit(section);
  //   });
  // }
  //
  // delete($event): void {
  //   this.restaurantService.deleteImage(this.slug, this.item._id).subscribe((item) => {
  //     this.item = item;
  //   });
  //   event.stopPropagation();
  // }

  discard(): void {
    this.editMode = false;
    this.item = { ...this.itemOriginal };
  }

  setImage(url: string): void {
    this.item.image = url;
  }
}



