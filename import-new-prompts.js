import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://vxpppjhsnnfoggigxupo.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cHBwamhzbm5mb2dnaWd4dXBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2ODQyOCwiZXhwIjoyMDg3NTQ0NDI4fQ.cZyVuWdntAHir-8paDUfkzNClCAylAobTLs0-KW9P-s'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function importNewPrompts() {
  console.log('Importing new 90-prompt library...\n')

  // Read the JSON file
  const rawData = fs.readFileSync('/data/.openclaw/workspace/cineworkflo/new-prompts.json', 'utf8')
  const newPrompts = JSON.parse(rawData)

  console.log(`Loaded ${newPrompts.length} prompts from JSON`)

  // Transform to database format
  const transformedPrompts = newPrompts.map((p, index) => ({
    title: p.prompt.split(',')[0].substring(0, 50) + (p.prompt.split(',')[0].length > 50 ? '...' : ''),
    prompt: p.prompt,
    category: p.category,
    tool: p.best_on[0] || 'Runway', // Use first recommended tool
    tags: [p.style, ...p.best_on, ...p.audience].filter(Boolean),
    is_premium: index >= 25 // First 25 free, rest pro
  }))

  console.log(`Transformed ${transformedPrompts.length} prompts`)
  console.log(`- Free: ${transformedPrompts.filter(p => !p.is_premium).length}`)
  console.log(`- Pro: ${transformedPrompts.filter(p => p.is_premium).length}`)

  // Clear existing prompts
  console.log('\nClearing existing prompts...')
  const { error: deleteError } = await supabase
    .from('prompts')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  
  if (deleteError) {
    console.error('Error clearing:', deleteError.message)
    return
  }

  // Insert new prompts
  console.log('Inserting new prompts...')
  const { data, error } = await supabase
    .from('prompts')
    .insert(transformedPrompts)
    .select()

  if (error) {
    console.error('Error inserting:', error.message)
    return
  }

  console.log(`\n✅ Successfully imported ${data.length} prompts!`)
  
  // Show breakdown by category
  const categories = {}
  transformedPrompts.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1
  })
  
  console.log('\nBy Category:')
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`  - ${cat}: ${count}`)
  })
}

importNewPrompts()
