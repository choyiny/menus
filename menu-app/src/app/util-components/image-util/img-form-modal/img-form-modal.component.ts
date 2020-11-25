import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from '../../../services/menu.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { RestaurantPermissionService } from '../../../services/restaurantPermission.service';

@Component({
  selector: 'app-img-form-modal',
  templateUrl: './img-form-modal.component.html',
  styleUrls: ['./img-form-modal.component.scss'],
})
export class ImgFormModalComponent implements OnInit {
  @ViewChild('template') input;
  file;
  @Input() itemId: string;
  @Output() itemEmitter = new EventEmitter<string>();

  slug: string;
  menuName: string;

  constructor(
    private modalService: NgbModal,
    private restaurantService: RestaurantService,
    public restaurantPermissionService: RestaurantPermissionService
  ) {}

  ngOnInit(): void {
    this.restaurantPermissionService.slugObservable.subscribe((slug) => (this.slug = slug));
    this.restaurantPermissionService.menuNameObservable.subscribe(
      (menuName) => (this.menuName = menuName)
    );
  }

  open(): void {
    this.modalService.open(this.input);
  }

  onSubmit(modal, image): void {
    modal.close();
    this.file = image;
    const dataUrl = this.file;
    this.itemEmitter.emit('assets/loading.gif');
    if (dataUrl) {
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'image', { type: 'image/png' });
          const formData = new FormData();
          formData.append('file', file);
          this.restaurantService
            .uploadPhoto(this.slug, this.menuName, this.itemId, formData)
            .subscribe((url) => {
              this.itemEmitter.emit(url);
            });
        });
    }
  }
}
