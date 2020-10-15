import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TracingService } from '../../services/tracing.service';
import { MenuInterface } from '../../interfaces/menus-interface';

@Component({
  selector: 'app-covid-modal',
  templateUrl: './covid-modal.component.html',
  styleUrls: ['./covid-modal.component.scss'],
})
export class CovidModalComponent implements OnInit {
  @ViewChild('modalContent') input;
  tracingForm: FormGroup;
  @Input() menu: MenuInterface;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private tracingService: TracingService
  ) {}

  ngOnInit(): void {
    this.tracingForm = this.fb.group({
      name: [''],
      phone_number: [''],
    });
  }

  open(): void {
    this.modalService.open(this.input);
  }

  submit(): void {
    const contact = {
      name: this.tracingForm.value.name,
      phone_number: `+1${this.tracingForm.value.phone_number}`,
      key: this.menu.tracing_key,
    };
    this.tracingService.traceCustomer(this.menu.name, contact).subscribe((timeIn) => {
      localStorage.setItem('time_in', JSON.stringify(timeIn));
      this.modalService.dismissAll();
    });
  }
}
