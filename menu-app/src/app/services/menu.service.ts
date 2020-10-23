import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuInterface, CreateInterface, MenusInterface } from '../interfaces/menus-interface';
import { SectionInterface } from '../interfaces/section-interface';
import { MenuItemInterface } from '../interfaces/menu-item-interface';
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
    const url = `${environment.settings.endpoint}/menus/${slug}/items/${item}`;
    return this.http.patch<string>(url, uploadForm);
  }

  editMenu(slug: string, menu: MenuInterface): Observable<MenuInterface> {
    const url = `${environment.settings.endpoint}/menus/${slug}`;
    const body = this.cleanFields({
      name: menu.name,
      description: menu.description,
      external_link: menu.external_link,
      link_name: menu.link_name,
      image: menu.image,
    });
    return this.http.patch<MenuInterface>(url, body);
  }

  rearrangeSections(slug, sections: SectionInterface[]): any {
    const url = `${environment.settings.endpoint}/menus/${slug}`;
    return this.http.patch<MenuInterface>(url, { sections });
  }

  editSection(slug: string, section: SectionInterface): Observable<SectionInterface> {
    // Must sanitize quill fields
    section = this.cleanFields(section);
    const url = `${environment.settings.endpoint}/menus/${slug}/sections/${section._id}/edit`;
    return this.http.patch<SectionInterface>(url, section);
  }

  editItem(slug: string, item: MenuItemInterface): Observable<MenuItemInterface> {
    item = this.cleanFields(item);
    const url = `${environment.settings.endpoint}/menus/${slug}/items/${item._id}/edit`;
    return this.http.patch<MenuItemInterface>(url, item);
  }

  createMenu(menuBody: CreateInterface): Observable<MenuInterface> {
    menuBody = this.cleanFields(menuBody);
    const url = `${environment.settings.endpoint}/menus/`;
    return this.http.post<MenuInterface>(url, menuBody);
  }

  getMenus(query): Observable<MenusInterface> {
    const url = `${environment.settings.endpoint}/menus/all`;
    return this.http.get<MenusInterface>(url, { params: query });
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

  appendCsv(slug, formData): Observable<MenuInterface> {
    const url = `${environment.settings.endpoint}/menus/${slug}/items/import`;
    console.log(formData);
    return this.http.patch<MenuInterface>(url, formData);
  }
  generateQR(query): Observable<Blob> {
    const url = `${environment.settings.endpoint}/menus/generate`;
    return this.http.get(url, {
      params: query,
      responseType: 'blob',
    });
  }

  deleteImage(slug: string, itemId: string): Observable<MenuItemInterface> {
    const url = `${environment.settings.endpoint}/menus/${slug}/items/${itemId}/picture`;
    return this.http.delete<MenuItemInterface>(url);
  }

  newSection(slug: string, index: number): Observable<MenuInterface> {
    const url = `${environment.settings.endpoint}/menus/${slug}/sections/add_section`;
    console.log({ index });
    return this.http.post<MenuInterface>(url, { index });
  }

  cleanFields(body: object): any {
    for (const key in body) {
      if (body[key] === null) {
        delete body[key];
      }
    }
    return body;
  }

  addMenuItem(slug: string, sectionId: string): Observable<MenuItemInterface> {
    const url = `${environment.settings.endpoint}/menus/${slug}/sections/${sectionId}/add_item`;
    return this.http.post<MenuItemInterface>(url, {});
  }
}
