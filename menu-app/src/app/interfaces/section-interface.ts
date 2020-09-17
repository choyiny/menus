import { MenuItemInterface } from './menu-item-interface';

export interface SectionInterface {
  name: string;
  menu_items: MenuItemInterface[];
  description: string;
}
