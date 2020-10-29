import { SectionInterface } from './section-interface';

export interface MenuInterface {
  image: string;
  name: string;
  sections: SectionInterface[];
  description: string;
  external_link: string;
  link_name: string;
  tracing_key: string;
  enable_trace: boolean;
  force_trace: boolean;
}

export interface CreateInterface {
  image?: string;
  name?: string;
  description?: string;
  external_link?: string;
  link_name?: string;
  slug?: string;
}

export interface MenusInterface {
  menus: string[];
}

export interface MenuEditable {
  name?: string;
  description?: string;
  image?: string;
}
