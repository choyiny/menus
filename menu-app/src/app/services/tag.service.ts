import { Injectable } from '@angular/core';
import { faCarrot } from '@fortawesome/free-solid-svg-icons';
import { faPepperHot } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  tags = {
    'Chef Featured': faCarrot,
    Spicy: faPepperHot,
  };

  constructor() {}

  getTag(tag: string): IconDefinition {
    return this.tags[tag];
  }
}
