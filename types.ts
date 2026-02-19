export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Bookmark {
  id: string;
  user_id: string; // Changed to snake_case to match typical DB column
  title: string;
  url: string;
  created_at: string; // Supabase returns ISO string
}

export type Theme = 'light' | 'dark';