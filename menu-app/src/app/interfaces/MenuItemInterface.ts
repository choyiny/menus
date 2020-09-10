import { TagInterface } from './TagInterface';

export interface MenuItemInterface {
  image: string;
  name: string;
  price: string;
  sections: string[];
  tags: TagInterface[];
}
