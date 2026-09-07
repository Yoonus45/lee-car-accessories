import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Lee Car Accessories] Supabase env vars missing. ' +
    'Copy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

const _client = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Export as a typed wrapper so individual files get proper .from() inference
// but we bypass the strict generic inference that causes 'never' errors.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = _client as any
