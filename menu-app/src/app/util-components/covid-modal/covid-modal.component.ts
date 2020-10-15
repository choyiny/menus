import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-covid-modal',
  templateUrl: './covid-modal.component.html',
  styleUrls: ['./covid-modal.component.scss'],
})
export class CovidModalComponent implements OnInit {
  @ViewChild('modalContent') input;
  tracingForm: FormGroup;

  constructor(private modalService: NgbModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.tracingForm = this.fb.group({
      name: [''],
      phone_number: [''],
    });
  }

  open(): void {
    this.modalService.open(this.input);
  }

  submit(): void {}
}
