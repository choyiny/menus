import { Component, Input } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() image: string;

  constructor(private modalService: NgbModal) {}

  open(content): void {
    this.modalService.open(content);
  }
}
