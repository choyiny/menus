import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TracingService } from '../../services/tracing.service';
import { ContactInterface } from '../../interfaces/contact-interface';
import { Restaurant } from '../../interfaces/restaurant-interfaces';
import { RestaurantPermissionService } from '../../services/restaurantPermission.service';

@Component({
  selector: 'app-covid-modal',
  templateUrl: './covid-modal.component.html',
  styleUrls: ['./covid-modal.component.scss'],
})
export class CovidModalComponent implements OnInit {
  @ViewChild('modalContent') input;
  tracingForm: FormGroup;
  @Input() restaurant: Restaurant;
  nameError: string;
  phoneError: string;
  slug: string;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private tracingService: TracingService,
    private restaurantPermissionService: RestaurantPermissionService
  ) {}

  ngOnInit(): void {
    this.tracingForm = this.fb.group({
      name: [''],
      phone_number: [''],
    });
    this.restaurantPermissionService.getSlug().subscribe((slug) => {
      this.slug = slug;
    });
  }

  open(): void {
    this.modalService.open(this.input);
  }

  submit(): void {
    const contact = {
      name: this.tracingForm.value.name,
      phone_number: `+1${this.tracingForm.value.phone_number}`,
      key: this.restaurant.tracing_key,
    };
    this.validate(contact);
    if (this.phoneError === '' && this.nameError === '') {
      this.tracingService.traceCustomer(this.slug, contact).subscribe((timeIn) => {
        localStorage.setItem('time_in', JSON.stringify(timeIn));
        this.modalService.dismissAll();
      });
    }
  }

  validate(contact: ContactInterface): void {
    this.phoneError = '';
    this.nameError = '';
    if (contact.name === '') {
      this.nameError = 'Enter a name';
    } else if (!/^[a-zA-Z ]+$/.test(contact.name)) {
      this.nameError = 'Please enter  a valid name';
    } else if (contact.phone_number === '') {
      this.phoneError = 'Enter a phone_number';
    } else if (!/^[0-9]+$/.test(contact.phone_number.slice(2))) {
      this.phoneError = 'Enter numeric characters only';
    } else if (contact.phone_number.length !== 12) {
      this.phoneError = 'Phone number is not 10 characters';
    }
  }
}
