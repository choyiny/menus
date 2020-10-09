import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuInterface } from '../interfaces/menu-interface';
import { EnvService } from './env.service';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private http: HttpClient, private env: EnvService) {}
  getMenu(slug: string): Observable<MenuInterface> {
    return this.env.getEnvironment().pipe(
      mergeMap((environment) => {
        return this.http.get<MenuInterface>(`${environment.settings.endpoint}/menus/${slug}`);
      })
    );
  }

  uploadPhoto(slug: string, item: string, uploadForm): Observable<string> {
    return this.env.getEnvironment().pipe(
      mergeMap((environment) => {
        const url = `${environment.settings.endpoint}/menus/${slug}/items/${item}/pictures/upload`;
        return this.http.post<string>(url, uploadForm);
      })
    );
  }
}
