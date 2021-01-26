import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ImgViewModalComponent } from '../../util-components/image-util/img-view-modal/img-view-modal.component';
import { ImgFormModalComponent } from '../../util-components/image-util/img-form-modal/img-form-modal.component';
import { faPlus, faPen, faTrash, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { Item, MenuEditable, Section, Tag } from '../../interfaces/restaurant-interfaces';
import { RestaurantService } from '../../services/restaurant.service';
import { RestaurantPermissionService } from '../../services/restaurantPermission.service';

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
  @Output() itemDeleteEmitter = new EventEmitter<Item>();
  @Output() itemEmitter = new EventEmitter<Item>();
  @Input() editMode: boolean;
  @Input() sectionEdit: boolean;

  // icons
  faPlus = faPlus;
  faPen = faPen;
  deleteIcon = faTrash;
  faGrip = faArrowsAlt;

  expanded = false;

  slug: string;
  menuName: string;
  hasPermission: boolean;
  canUpload: boolean;

  constructor(
    private restaurantService: RestaurantService,
    public restaurantPermissionService: RestaurantPermissionService
  ) {}

  ngOnInit(): void {
    this.restaurantPermissionService.slugObservable.subscribe((slug) => (this.slug = slug));
    this.restaurantPermissionService.menuNameObservable.subscribe(
      (menuName) => (this.menuName = menuName)
    );
    this.restaurantPermissionService.hasPermissionObservable.subscribe(
      (hasPermission) => (this.hasPermission = hasPermission)
    );
    this.restaurantPermissionService.canUploadObservable.subscribe(
      (canUpload) => (this.canUpload = canUpload)
    );
  }

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
    this.edit();
    this.itemEmitter.emit();
    this.editMode = false;
  }

  remove(): void {
    this.itemDeleteEmitter.emit(this.itemOriginal);
  }

  editItem(): void {
    this.restaurantService.editItem(this.slug, this.menuName, this.item).subscribe(
      (item) => {
        this.item = item;
        this.itemOriginal = JSON.parse(JSON.stringify(item));
      },
      (err) => {}
    );
  }

  edit(): void {
    this.editMode = true;
    // Save item state, also do not use spread does not deep copy
    this.itemOriginal = JSON.parse(JSON.stringify(this.item));
  }

  expandDetails(): void {
    this.expanded = !this.expanded;
    // alert(this.expanded);
  }
}
