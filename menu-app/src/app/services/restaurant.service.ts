import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Restaurant} from "../interfaces/restaurant-interfaces";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) { }

  getRestaurant(slug: string): Observable<Restaurant>{
    const url = `${environment.settings.endpoint}/restaurant/${slug}`;
    return this.http.get<Restaurant>(url);
  }
}
