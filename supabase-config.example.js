/*
  supabase-config.example.js

  Example config (do NOT commit real keys). Copy this file to `supabase-config.js`
  and fill in your project's values. Keep `supabase-config.js` out of source control.
*/
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Replace with your Supabase project URL and anon key
const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'

// Optional publishable key (if provided by Supabase)
const SUPABASE_PUBLISHABLE_KEY = 'YOUR_SUPABASE_PUBLISHABLE_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
export { SUPABASE_PUBLISHABLE_KEY }
