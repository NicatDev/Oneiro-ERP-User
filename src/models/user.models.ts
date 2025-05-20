export interface User {
  uuid: string; 
  first_name: string;
  last_name: string;
  username: string;
  email?: string;
  phone_number?: string;
  created_at: string;
  last_login?: string;
  is_active: boolean;
}