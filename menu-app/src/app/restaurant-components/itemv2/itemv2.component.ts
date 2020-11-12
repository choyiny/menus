import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ImgViewModalComponent } from '../../util-components/image-util/img-view-modal/img-view-modal.component';
import { ImgFormModalComponent } from '../../util-components/image-util/img-form-modal/img-form-modal.component';
import { faPlus, faPen, faTrash, faSave, faImage } from '@fortawesome/free-solid-svg-icons';
import { Item, Section, Tag } from '../../interfaces/restaurant-interfaces';
import { RestaurantService } from '../../services/restaurant.service';
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-itemv2',
  templateUrl: './itemv2.component.html',
  styleUrls: ['./itemv2.component.scss'],
})
export class Itemv2Component implements OnInit {
  @Input() item: Item;
  itemOriginal: Item;
  @ViewChild(ImgViewModalComponent) imgView: ImgViewModalComponent;
  @ViewChild(ImgFormModalComponent) imgForm: ImgFormModalComponent;
  @Input() slug: string;
  @Input() menuName: string;
  @Input() hasPermission: boolean;
  @Output() sectionEmitter = new EventEmitter<Section>();
  editMode: boolean;
  // icons
  faPlus = faPlus;
  faPen = faPen;
  deleteIcon = faTrash;
  saveIcon = faSave;
  imageIcon = faImage;

  constructor(private restaurantService: RestaurantService, private tagService: TagService) {}

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

  editItem(): void {
    this.restaurantService.editItem(this.slug, this.menuName, this.item).subscribe((item) => {
      console.log(this.item);
      this.item = item;
      this.itemOriginal = { ...item };
    });
    this.editMode = false;
  }

  edit(): void {
    this.editMode = true;
  }

  addTag(): void {
    const newTag: Tag = {
      text: 'New tag',
      icon: 'no-icon',
      background_color: 'black',
    };
    this.item.tags.push(newTag);
    this.editItem();
  }

  updateTags(newValue, index): void {
    if (newValue) {
      this.item.tags[index] = {
        text: newValue,
        icon: newValue,
        background_color: 'black',
      };
    } else {
      this.item.tags.splice(index, 1);
    }
    this.editItem();
  }
  remove(): void {
    this.restaurantService
      .deleteItem(this.slug, this.menuName, this.item._id)
      .subscribe((section) => {
        this.sectionEmitter.emit(section);
      });
  }

  deletePhoto($event): void {
    this.restaurantService
      .deletePhoto(this.slug, this.menuName, this.item._id)
      .subscribe((item) => {
        this.item = item;
      });
    event.stopPropagation();
  }

  discard(): void {
    this.editMode = false;
    this.item = { ...this.itemOriginal };
  }

  setImage(url: string): void {
    this.item.image = url;
  }
}
