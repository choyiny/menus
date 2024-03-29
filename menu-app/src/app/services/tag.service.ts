import { Injectable } from '@angular/core';
import { faPepperHot } from '@fortawesome/free-solid-svg-icons';
import { faHatChef } from '@fortawesome/pro-light-svg-icons';
import { faArrowToTop } from '@fortawesome/pro-solid-svg-icons';
import { faThumbsUp, faLeaf } from '@fortawesome/pro-solid-svg-icons';
import { TagDisplay } from '../interfaces/tag-display';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  tags = {
    'Chef Featured': {
      text: "Chef's Featured",
      icons: [faHatChef],
      backgroundColor: 'black',
    },
    Recommended: {
      text: 'Recommended',
      icons: [faThumbsUp],
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
      backgroundColor: '#ee3353',
    },
    Peanut: {
      text: 'May Contain Peanuts',
      icons: [],
      backgroundColor: 'black',
    },
    "Chef's Choice": {
      text: "Chef's Choice",
      icons: [faHatChef],
      backgroundColor: 'black',
    },
    'Top Pick': {
      text: 'Top Pick',
      icons: [faArrowToTop],
      backgroundColor: 'black',
    },
    'Exquisite Flavor': {
      text: 'Exquisite Flavor',
      icons: [],
      backgroundColor: 'black',
    },
    Vegetarian: {
      text: 'Vegetarian',
      icons: [faLeaf],
      backgroundColor: '#18be18',
    },
  };

  icons = {
    Vegetarian: [faLeaf],
    'Top Pick': [faArrowToTop],
    "Chef's choice": [faHatChef],
    "Chef's feautured": [faHatChef],
    Spicy3: [faPepperHot, faPepperHot, faPepperHot],
    Spicy2: [faPepperHot, faPepperHot],
    Spicy: [faPepperHot],
    Recommended: [faThumbsUp],
  };

  constructor() {}

  getIcon(icon: string): any {
    if (this.icons[icon] !== undefined) {
      return this.icons[icon];
    } else {
      return [];
    }
  }

  getTag(tag: string): TagDisplay {
    if (this.tags[tag] === undefined) {
      return {
        text: tag,
        icons: [],
        backgroundColor: 'black',
      };
    } else {
      return this.tags[tag];
    }
  }
}
