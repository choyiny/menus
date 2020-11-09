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

  @ViewChild('firstMenu') firstMenu;
  constructor(private fb: FormBuilder, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.newMenu = this.fb.group({
      slug: [''],
      name: [''],
      sectionName: [''],
      itemName: [''],
      itemDescription: [''],
      itemPrice: ['']
    });
  }

  next(): void {
    const slug = this.newMenu.value.slug;
    const name = this.newMenu.value.name;
  }

  open(): void {
    this.modalService.open(this.firstMenu);
  }
}
