import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {AnnotatedImage} from '../interfaces/result-interface';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OcrService {

  constructor(private http: HttpClient) { }

  recognizeImage(form: FormData): Observable<AnnotatedImage> {
    const url = `${environment.settings.endpoint}/recognize`;
    return this.http.post<AnnotatedImage>(url, form);
  }
}
