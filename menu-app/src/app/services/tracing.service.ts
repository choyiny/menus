import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ContactInterface } from '../interfaces/contact-interface';
import { TimeInterface } from '../interfaces/time-interface';
import { MenuInterface } from '../interfaces/menus-interface';
import { TracingFormInterface } from '../interfaces/tracing-form-interface';
import {Restaurant} from "../interfaces/restaurant-interfaces";

@Injectable({
  providedIn: 'root',
})
export class TracingService {
  constructor(private http: HttpClient) {}

  traceCustomer(name: string, contact: ContactInterface): Observable<TimeInterface> {
    const url = `${environment.settings.tracing_api}/locations/${name}/customers`;
    return this.http.post<TimeInterface>(url, contact);
  }

  configureTracing(slug: string, tracingForm: TracingFormInterface): Observable<Restaurant> {
    const url = `${environment.settings.endpoint}/admin/restaurants/${slug}/tracing`;
    return this.http.patch<Restaurant>(url, tracingForm);
  }
}
