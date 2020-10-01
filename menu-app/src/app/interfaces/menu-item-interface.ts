import { TagInterface } from './tag-interface';

export interface MenuItemInterface {
  image: string;
  name: string;
  price: string;
  sections: string[];
  tags: TagInterface[];
  description: string;
  _id: string;
}
