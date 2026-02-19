import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; 
export const isUsingDemoKeys = false;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
