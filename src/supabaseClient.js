import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lrxddylwedbrscvbuehw.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_NR8AOgsYRCw9MgoUMkHMaQ_q1KlQk1y'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
