import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from '../../services/menu.service';
import { ImageFormComponent } from '../image-form/image-form.component';

@Component({
  selector: 'app-img-form-modal',
  templateUrl: './img-form-modal.component.html',
  styleUrls: ['./img-form-modal.component.scss'],
})
export class ImgFormModalComponent implements OnInit {
  @ViewChild('template') input;
  file;

  constructor(private modalService: NgbModal, private menuService: MenuService) {}

  ngOnInit(): void {}

  open(): void {
    this.modalService.open(this.input);
  }

  setImage(modal, image): void {
    modal.close();
    console.log(image);
    this.file = image;
  }
}
