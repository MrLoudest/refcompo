import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env missing: VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(url as string, anon as string, {
  auth: { persistSession: true, autoRefreshToken: true }
});


