import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  'https://sjqmmkfafotvjhupujoi.supabase.co';

const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_C3TvLpCopYeqcou9OXPjfg_iv9IJx10';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);