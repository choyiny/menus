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
  @Input() editMode: boolean;
  // icons
  faPlus = faPlus;
  faPen = faPen;
  deleteIcon = faTrash;

  constructor(private restaurantService: RestaurantService, private tagService: TagService) {}

  ngOnInit(): void {}

  addTag(): void {
    const newTag: Tag = {
      text: 'Edit tag',
      icon: '',
      background_color: 'black',
    };
    this.item.tags.push(newTag);
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
  }

  deletePhoto(): void {
    this.restaurantService
      .deletePhoto(this.slug, this.menuName, this.item._id)
      .subscribe((item) => {
        this.item = item;
      });
  }

  setImage(url: string): void {
    this.editMode = false;
    this.item.image = url;
  }

  showImage(): void {
    this.imgView.open();
  }

  cropImage(): void {
    this.imgForm.open();
  }

  discard(): void {
    this.editMode = false;
    this.item = JSON.parse(JSON.stringify(this.itemOriginal));
  }

  save(): void {
    this.editItem();
    this.editMode = false;
  }

  remove(): void {
    this.restaurantService
      .deleteItem(this.slug, this.menuName, this.item._id)
      .subscribe((section) => {
        this.sectionEmitter.emit(section);
      });
  }

  editItem(): void {
    this.restaurantService.editItem(this.slug, this.menuName, this.item).subscribe((item) => {
      this.item = item;
      this.itemOriginal = JSON.parse(JSON.stringify(item));
    });
  }

  edit(): void {
    this.editMode = true;
    // Save item state, also do not use spread does not deep copy
    this.itemOriginal = JSON.parse(JSON.stringify(this.item));
  }
}
