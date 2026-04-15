import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vxpppjhsnnfoggigxupo.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cHBwamhzbm5mb2dnaWd4dXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5Njg0MjgsImV4cCI6MjA4NzU0NDQyOH0.1yFxUkXP9Tvvyxn81BtC1gEQy8sYO1a5vrZh8CSPBtM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
