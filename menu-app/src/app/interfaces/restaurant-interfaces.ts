export interface Restaurant {
  image?: string;
  name?: string;
  menus: string[];
  description?: string;
  tracing_key: string;
  enable_trace: boolean;
  force_trace: boolean;
  public: boolean;
  qrcode_link: string;
}

export interface RestaurantOnboarding {
  name: string;
  item_name: string;
  item_price: string;
  item_description: string;
  section_name: string;
}

export interface RestaurantEditable {
  image?: string;
  name?: string;
  description?: string;
  menus?: string[];
  qrcode_link?: string;
  tracing_key?: string;
  enable_trace?: boolean;
  force_trace?: boolean;
  public?: boolean;
}

export interface RestaurantTemplate {
  description?: string;
  name?: string;
  image?: string;
  slug: string;
}

export interface RestaurantPaginated {
  restaurants: string[];
}

export interface Tag {
  text: string;
  icon: string;
  background_color: string;
}

export interface Item {
  name?: string;
  price?: string;
  description?: string;
  _id: string;
  image?: string;
  tags: Tag[];
}

export interface Section {
  name?: string;
  description?: string;
  subtitle?: string;
  menu_items: Item[];
  _id: string;
}

export interface Menu {
  name: string;
  sections: Section[];
}

export interface MenuEditable {
  name?: string;
  sections?: Section[];
}
