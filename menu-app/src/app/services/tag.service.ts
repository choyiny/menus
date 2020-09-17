import { Injectable } from '@angular/core';
import { faCarrot } from '@fortawesome/free-solid-svg-icons';
import { faPepperHot } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  tags = {
    'Chef Featured': faCarrot,
    spicy: faPepperHot,
  };

  constructor() {}

  getTag(tag: string): any {
    return this.tags[tag];
  }
}
