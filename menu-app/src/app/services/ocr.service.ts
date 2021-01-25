import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Results } from '../interfaces/result-interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OcrService {
  constructor(private http: HttpClient) {}

  recognizeImage(form: FormData): Observable<Results> {
    const url = `${environment.settings.endpoint}/recognize`;
    return this.http.post<Results>(url, form);
  }
}
