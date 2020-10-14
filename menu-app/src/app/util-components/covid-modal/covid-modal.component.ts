import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-covid-modal',
  templateUrl: './covid-modal.component.html',
  styleUrls: ['./covid-modal.component.scss'],
})
export class CovidModalComponent implements OnInit {
  @ViewChild('content') input;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  open(): void {
    this.modalService.open(this.input);
  }
}
