import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuInterface } from '../interfaces/menu-interface';
import { SectionInterface } from '../interfaces/section-interface';
import { MenuItemInterface } from '../interfaces/menu-item-interface';
import { environment } from '../../environments/environment';
import { MenuCreateInterface } from '../interfaces/menu-create';
import { MenusAdminInterface as Menus } from '../interfaces/menus-admin-interface';

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

  editSection(slug: string, section: SectionInterface): Observable<SectionInterface> {
    // Must sanitize quill fields
    if (section.description == null) {
      section.description = '';
    }
    const url = `${environment.settings.endpoint}/menus/${slug}/sections/${section._id}/edit`;
    return this.http.patch<SectionInterface>(url, section);
  }

  editItem(slug: string, item: MenuItemInterface): Observable<MenuItemInterface> {
    // Must sanitize quill fields
    if (item.description == null) {
      item.description = '';
    }
    const url = `${environment.settings.endpoint}/menus/${slug}/items/${item._id}/edit`;
    return this.http.patch<MenuItemInterface>(url, item);
  }

  createMenu(menuBody: MenuCreateInterface): Observable<MenuInterface> {
    const url = `${environment.settings.endpoint}/menus/`;
    return this.http.post<MenuInterface>(url, menuBody);
  }

  getMenus(query): Observable<Menus> {
    const url = `${environment.settings.endpoint}/menus/all`;
    return this.http.get<Menus>(url, { params: query });
  }

  deleteMenu(slug): Observable<MenuInterface> {
    const url = `${environment.settings.endpoint}/menus/${slug}`;
    return this.http.delete<MenuInterface>(url);
  }

  uploadCsv(slug, formData): Observable<MenuInterface> {
    const url = `${environment.settings.endpoint}/menus/${slug}/items/import`;
    console.log(formData);
    return this.http.post<MenuInterface>(url, formData);
  }
  generateQR(query): Observable<Blob> {
    const url = `${environment.settings.endpoint}/menus/generate`;
    return this.http.get(url, {
      params: query,
      responseType: 'blob',
    });
  }
}
