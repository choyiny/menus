import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-first-menu',
  templateUrl: './first-menu.component.html',
  styleUrls: ['./first-menu.component.scss']
})
export class FirstMenuComponent implements OnInit {

  newMenu: FormGroup;

  @ViewChild('register') register;
  constructor(private fb: FormBuilder, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.newMenu = this.fb.group({
      slug: [''],
      name: [''],
      sectionName: [''],
      itemName: [''],
      itemPrice: ['']
    });
  }

  open(): void {
    this.modalService.open(this.register);
  }
}
