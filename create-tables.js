import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vxpppjhsnnfoggigxupo.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cHBwamhzbm5mb2dnaWd4dXBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2ODQyOCwiZXhwIjoyMDg3NTQ0NDI4fQ.cZyVuWdntAHir-8paDUfkzNClCAylAobTLs0-KW9P-s'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
  console.log('Creating database tables...\n')

  // Create prompts table
  const { error: promptsError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS prompts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        prompt TEXT NOT NULL,
        category TEXT NOT NULL,
        tool TEXT NOT NULL,
        tags TEXT[] DEFAULT '{}',
        is_premium BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
      );
    `
  })

  if (promptsError) {
    console.log('Trying alternative method...')
    
    // Use REST API directly
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS prompts (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            prompt TEXT NOT NULL,
            category TEXT NOT NULL,
            tool TEXT NOT NULL,
            tags TEXT[] DEFAULT '{}',
            is_premium BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `
      })
    })
    
    if (!response.ok) {
      console.error('Error creating table via REST:', await response.text())
      return
    }
  }

  console.log('✓ Table created successfully!')
}

createTables()
