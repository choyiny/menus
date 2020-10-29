import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-img-view-modal',
  templateUrl: './img-view-modal.component.html',
  styleUrls: ['./img-view-modal.component.scss'],
})
export class ImgViewModalComponent implements OnInit {
  @Input() image: string;
  @ViewChild('content') input;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  open(): void {
    this.modalService.open(this.input);
  }
}
