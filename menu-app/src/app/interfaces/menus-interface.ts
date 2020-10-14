import { SectionInterface } from './section-interface';

export interface MenuInterface {
  image: string;
  name: string;
  sections: SectionInterface[];
  description: string;
  external_link: string;
  link_name: string;
}

export interface CreateInterface {
  image?: string;
  name?: string;
  description?: string;
  external_link?: string;
  link_name?: string;
  slug?: string;
}

export interface SlugInterface {
  name: string;
  slug: string;
}

export interface PaginatedInterface {
  menus: SlugInterface;
}
