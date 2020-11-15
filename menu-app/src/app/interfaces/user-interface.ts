export interface UserInterface {
  phone_number: string;
  firebase_id: string;
  restaurants: string[];
  is_admin: boolean;
  email: string;
  display_name: string;
  photo_url: string;
  is_anon: boolean;
}

export interface UsersInterface {
  users: UserInterface[];
}

export interface UsersWithPaginationInterface extends UsersInterface {
  total_page: number;
}

export interface NewUserInterface {
  email: string;
  email_verified: boolean;
  phone_number: string;
  password: string;
  display_name: string;
  photo_url: string;
  restaurants: string[];
}

export interface LinkUserInterface {
  firebase_id: string;
  restaurants: string[];
}
