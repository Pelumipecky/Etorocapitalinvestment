import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const envLabel = import.meta.env.MODE || 'development'
const missingVars = [
  !supabaseUrl && 'VITE_SUPABASE_URL',
  !supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY'
].filter(Boolean)

// Debug logging
console.log('[supabaseConfig] Environment check:', {
  envLabel,
  supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
  supabaseAnonKey: supabaseAnonKey ? 'SET' : 'NOT SET',
  missingVars
})

const isProductionLike = envLabel === 'production'

const createNoopClient = () => new Proxy({}, {
  get(_, prop) {
    // Only throw error if we're actually trying to use the client in production
    if (isProductionLike) {
      throw new Error(
        `Supabase client is unavailable (${missingVars.join(', ') || 'unknown missing vars'}). ` +
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use this API.'
      )
    }
    // In development/build, return a noop function
    return () => {}
  }
})

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : createNoopClient()

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Log configuration status
if (!isSupabaseConfigured) {
  console.warn('[supabaseConfig] Supabase not configured. Missing:', missingVars.join(', '))
} else {
  console.log('[supabaseConfig] Supabase client initialized successfully')
}
