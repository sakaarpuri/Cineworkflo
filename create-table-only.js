import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vxpppjhsnnfoggigxupo.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cHBwamhzbm5mb2dnaWd4dXBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2ODQyOCwiZXhwIjoyMDg3NTQ0NDI4fQ.cZyVuWdntAHir-8paDUfkzNClCAylAobTLs0-KW9P-s'

// Use PostgREST directly
async function createTable() {
  const sql = `CREATE TABLE IF NOT EXISTS prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    category TEXT NOT NULL,
    tool TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql })
    })

    const result = await response.text()
    console.log('Create table result:', result)
    
    if (!response.ok) {
      console.log('Trying alternative: Direct REST API insert (table might exist)...')
      return false
    }
    return true
  } catch (err) {
    console.error('Error:', err.message)
    return false
  }
}

async function setupRLS() {
  const policies = [
    `ALTER TABLE prompts ENABLE ROW LEVEL SECURITY`,
    `CREATE POLICY IF NOT EXISTS "Allow public read prompts" ON prompts FOR SELECT USING (true)`,
    `CREATE POLICY IF NOT EXISTS "Allow insert prompts" ON prompts FOR INSERT WITH CHECK (true)`
  ]

  for (const sql of policies) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({ sql })
      })
    } catch (e) {
      // Ignore errors
    }
  }
}

createTable().then(success => {
  console.log('Table creation attempted:', success ? 'Success' : 'May need manual creation')
  setupRLS()
})
