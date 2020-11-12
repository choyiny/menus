import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-manage-sections',
  templateUrl: './manage-sections.component.html',
  styleUrls: ['./manage-sections.component.scss']
})
export class ManageSectionsComponent implements OnInit {

  @ViewChild('section') modal;
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(): void {
    this.modalService.open(this.modal);
  }

}
