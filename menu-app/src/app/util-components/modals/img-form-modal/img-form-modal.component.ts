import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-img-form-modal',
  templateUrl: './img-form-modal.component.html',
  styleUrls: ['./img-form-modal.component.scss'],
})
export class ImgFormModalComponent implements OnInit {
  @ViewChild('template') input;
  file;
  @Input() itemId: string;
  @Input() slug: string;
  @Output() itemEmitter = new EventEmitter<string>();

  constructor(private modalService: NgbModal, private menuService: MenuService) {}

  ngOnInit(): void {}

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
          this.menuService.uploadPhoto(this.slug, this.itemId, formData).subscribe((url) => {
            this.itemEmitter.emit(url);
          });
        });
    }
  }
}
