import { SectionInterface } from './section-interface';

export interface MenuInterface {
  image: string;
  name: string;
  sections: SectionInterface[];
  description: string;
}
