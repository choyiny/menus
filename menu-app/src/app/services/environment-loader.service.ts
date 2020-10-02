import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { EnvironmentInterface } from '../interfaces/environment-interface';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentLoaderService {
  private readonly CONFIG_URL = 'assets/environment.json';
  private configuration$: Observable<EnvironmentInterface>;

  constructor(private http: HttpClient) {}

  public loadConfigurations(): any {
    if (!this.configuration$) {
      this.configuration$ = this.http
        .get<EnvironmentInterface>(this.CONFIG_URL)
        .pipe(shareReplay(1));
    }
    return this.configuration$;
  }
}
