import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {faQrcode} from "@fortawesome/pro-solid-svg-icons";

@Component({
  selector: 'app-publish-modal',
  templateUrl: './publish-modal.component.html',
  styleUrls: ['./publish-modal.component.scss']
})
export class PublishModalComponent implements OnInit {

  @ViewChild('publish') publishModal;

  // Icons
  qrIcon = faQrcode;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(): void {
    this.modalService.open(this.publishModal);
  }

}
