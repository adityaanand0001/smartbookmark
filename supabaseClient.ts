import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://bauhstofdbyyjodclkcv.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhdWhzdG9mZGJ5eWpvZGNsa2N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzY4NDAsImV4cCI6MjA4NjkxMjg0MH0.K1NtRDIcYPKFD26-aEKzZqiCgOIZexHBFzRjw_VNrZQ';

export const isUsingDemoKeys = false;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);