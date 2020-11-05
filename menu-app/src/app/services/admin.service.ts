import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Restaurants} from '../interfaces/restaurant-interfaces';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getRestaurants(query): Observable<Restaurants> {
    const url = `${environment.settings.endpoint}/admin/restaurants`;
    return this.http.get<Restaurants>(url, {params: query});
  }
}
