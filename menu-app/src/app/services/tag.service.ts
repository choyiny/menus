import { Injectable } from '@angular/core';
import { faCarrot } from '@fortawesome/free-solid-svg-icons';
import { faPepperHot } from '@fortawesome/free-solid-svg-icons';
import { TagDisplay } from '../interfaces/tag-display';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  tags = {
    'Chef Featured': {
      text: "Chef's Featured",
      icons: [faCarrot],
      backgroundColor: 'black',
    },
    Recommended: {
      text: 'Recommended',
      backgroundColor: 'black',
    },
    Spicy: {
      text: '',
      icons: [faPepperHot],
      backgroundColor: '#EE3353',
    },
    Spicy2: {
      text: '',
      icons: [faPepperHot, faPepperHot],
      backgroundColor: '#EE3353',
    },

    Spicy3: {
      text: '',
      icons: [faPepperHot, faPepperHot, faPepperHot],
      backgroundColor: '#EE3353',
    },
  };

  constructor() {}

  getTag(tag: string): TagDisplay {
    return this.tags[tag];
  }
}
