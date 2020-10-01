import { SectionInterface } from './section-interface';

export interface MenuInterface {
  image: string;
  name: string;
  sections: SectionInterface[];
  description: string;
  external_link: string;
  link_name: string;
}
