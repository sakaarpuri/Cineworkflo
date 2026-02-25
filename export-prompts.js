import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://vxpppjhsnnfoggigxupo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cHBwamhzbm5mb2dnaWd4dXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5Njg0MjgsImV4cCI6MjA4NzU0NDQyOH0.1yFxUkXP9Tvvyxn81BtC1gEQy8sYO1a5vrZh8CSPBtM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function exportPrompts() {
  console.log('Fetching all prompts from database...')
  
  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('*')
    .order('is_premium', { ascending: true })
    .order('category')
    .order('title')

  if (error) {
    console.error('Error:', error.message)
    return
  }

  // Create CSV header
  let csv = 'ID,Title,Category,Tool,Tags,Tier,Prompt Text\n'
  
  // Add each prompt
  prompts.forEach((p, index) => {
    const tier = p.is_premium ? 'Pro' : 'Free'
    const tags = p.tags ? p.tags.join(', ') : ''
    // Escape quotes and newlines in prompt text
    const promptText = `"${p.prompt.replace(/"/g, '""').replace(/\n/g, ' ')}"`
    
    csv += `${index + 1},"${p.title}","${p.category}","${p.tool}","${tags}","${tier}",${promptText}\n`
  })

  // Save to file
  fs.writeFileSync('/data/.openclaw/workspace/cineworkflo/prompts-export.csv', csv)
  
  console.log(`✓ Exported ${prompts.length} prompts to prompts-export.csv`)
  console.log(`\nBreakdown:`)
  console.log(`- Free: ${prompts.filter(p => !p.is_premium).length}`)
  console.log(`- Pro: ${prompts.filter(p => p.is_premium).length}`)
}

exportPrompts()
