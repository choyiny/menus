import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuInterface } from '../interfaces/menu-interface';
import { SectionInterface } from '../interfaces/section-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private http: HttpClient) {}
  getMenu(slug: string): Observable<MenuInterface> {
    return this.http.get<MenuInterface>(`${environment.settings.endpoint}/menus/${slug}`);
  }

  uploadPhoto(slug: string, item: string, uploadForm): Observable<string> {
    const url = `${environment.settings.endpoint}/menus/${slug}/items/${item}/pictures/upload`;
    return this.http.post<string>(url, uploadForm);
  }

  editMenu(slug: string, menu: MenuInterface): Observable<MenuInterface> {
    const url = `${environment.settings.endpoint}/menus/${slug}`;
    return this.http.patch<MenuInterface>(url, {
      name: menu.name,
      description: menu.description,
      external_link: menu.external_link,
      link_name: menu.link_name,
    });
  }

  editSection(slug: string, section: SectionInterface): Observable<MenuInterface> {
    const url = `${environment.settings.endpoint}/menus/${slug}/section/${section._id}/edit`;
    return this.http.patch<MenuInterface>(url, section);
  }
}
