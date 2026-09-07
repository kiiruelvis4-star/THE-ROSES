import { createClient } from '@supabase/supabase-js';

// Supabase Cloud Configuration for Little Roses Academy
export const SUPABASE_URL = 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
  'https://lrxddylwedbrscvbuehw.supabase.co';

export const SUPABASE_ANON_KEY = 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
  'sb_publishable_NR8AOgsYRCw9MgoUMkHMaQ_q1KlQk1y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
