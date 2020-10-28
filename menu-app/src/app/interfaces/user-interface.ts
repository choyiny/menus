export interface UserInterface {
  phone_number: string;
  firebase_id: string;
  menus: string[];
  is_admin: boolean;
  email: string;
  display_name: string;
  photo_url: string;
}

export interface UsersInterface {
  users: UserInterface[];
}

export interface NewUserInterface {
  email: string;
  email_verified: boolean;
  phone_number: string;
  password: string;
  display_name: string;
  photo_url: string;
  menus: string[];
}

export interface LinkUserInterface {
  firebase_id: string;
  menus: string[];
}
