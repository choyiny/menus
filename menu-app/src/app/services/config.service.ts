import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ConfigInterface } from '../interfaces/config-interface';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly CONFIG_URL = 'assets/config/config.json';
  private configuration$: Observable<ConfigInterface>;

  constructor(private http: HttpClient) {}

  public loadConfigurations(): any {
    if (!this.configuration$) {
      this.configuration$ = this.http.get<ConfigInterface>(this.CONFIG_URL).pipe(shareReplay(1));
    }
    return this.configuration$;
  }
}
