import prompts from './src/data/prompts-new.json' assert { type: 'json' };

// Transform prompts to match database schema
const transformedPrompts = prompts.map(p => ({
  title: p.prompt.substring(0, 60) + (p.prompt.length > 60 ? '...' : ''),
  prompt: p.prompt,
  category: p.category,
  tool: p.best_on[0],
  tags: [p.style, ...p.audience],
  is_premium: p.id > 25, // First 25 free, rest premium
  variables: p.variables
}));

console.log(`Transformed ${transformedPrompts.length} prompts`);
console.log('Sample:', transformedPrompts[0]);

// Export for Supabase import
export { transformedPrompts };
