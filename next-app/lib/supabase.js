import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vxpppjhsnnfoggigxupo.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdWIiLCJyZWYiOiJ2eHBwcGpoc25uZm9nZ2lneHVwbyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcxOTY4NDI4LCJleHAiOjIwODc1NDQ0Mjh9.1yFxUkXP9Tvvyxn81BtC1gEQy8sYO1a5vrZh8CSPBtM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
