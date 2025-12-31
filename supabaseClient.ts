import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_API_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_API_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or API Key is missing. Check your .env file.');
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('EXPO_PUBLIC_')));
  throw new Error('Supabase configuration is incomplete');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});