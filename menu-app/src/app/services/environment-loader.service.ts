import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { EnvironmentInterface } from '../interfaces/environment-interface';
import { EnvService } from './env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentLoaderService {
  private readonly CONFIG_URL = 'assets/environment.json';
  private configuration$: Observable<EnvironmentInterface>;

  constructor(private http: HttpClient, private env: EnvService) {}

  public loadConfigurations(): any {
    if (!this.configuration$) {
      this.configuration$ = this.http
        .get<EnvironmentInterface>(this.CONFIG_URL)
        .pipe(shareReplay(1));
    } else {
      this.configuration$ = of(environment);
    }
    this.env.setEnvironment(this.configuration$);
    return this.configuration$;
  }
}
