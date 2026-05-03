import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

let supabaseInstance: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn('⚠️ Supabase not configured. Auth features will be disabled. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to enable.')
}

export const supabase = supabaseInstance
