import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  constructor() {}

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    const headerOffset = document.getElementById('wrapper').offsetHeight;
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - headerOffset;
    window.scrollTo({ top: offsetPosition, left: 0, behavior: 'smooth' });
  }
}
