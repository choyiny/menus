import { Injectable } from '@angular/core';
import { EnvironmentInterface } from '../interfaces/environment-interface';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnvService {
  private env = new ReplaySubject<EnvironmentInterface>(1);

  constructor() {}

  setEnvironment(env: Observable<EnvironmentInterface>): void {
    env.subscribe((data) => {
      this.env.next(data);
    });
  }

  getEnvironment(): ReplaySubject<EnvironmentInterface> {
    return this.env;
  }
}
