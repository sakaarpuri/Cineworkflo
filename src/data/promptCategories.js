import rawPromptLibrary from './ai_video_prompt_library.json'

const CATEGORY_ORDER = [
  'Brand & Product Ads',
  'Social & Short-Form Content',
  'Cinematic & Storytelling',
  'World & Environment Building',
  'Abstract & Motion Art',
  'AI Avatar & Character',
  'Sci-Fi & Concept Film',
  'Food & Cooking',
  'Real Estate & Architecture'
]

export const CATEGORY_COLORS = {
  'Brand & Product Ads': '#F59E0B',
  'Social & Short-Form Content': '#10B981',
  'Cinematic & Storytelling': '#3B82F6',
  'World & Environment Building': '#14B8A6',
  'Abstract & Motion Art': '#8B5CF6',
  'AI Avatar & Character': '#EC4899',
  'Sci-Fi & Concept Film': '#6366F1',
  'Food & Cooking': '#F97316',
  'Real Estate & Architecture': '#78716C'
}

const CATEGORY_METADATA = {
  'Brand & Product Ads': {
    description: 'Commercial prompt structures for high-conversion brand and product videos.',
    intent: 'Prompts for product reveals, brand films, and ad-ready visual storytelling.'
  },
  'Social & Short-Form Content': {
    description: 'Fast, scroll-stopping prompts designed for short-form social formats.',
    intent: 'Prompts for creator-style hooks, vertical edits, and high-retention short videos.'
  },
  'Cinematic & Storytelling': {
    description: 'Narrative-focused prompts with cinematic camera language and pacing.',
    intent: 'Prompts for dramatic scenes, storytelling arcs, and film-style visual sequences.'
  },
  'World & Environment Building': {
    description: 'Environment-first prompts for immersive locations and world scale.',
    intent: 'Prompts for establishing shots, atmospheric landscapes, and place-driven storytelling.'
  },
  'Abstract & Motion Art': {
    description: 'Experimental prompts built around motion design and abstract visuals.',
    intent: 'Prompts for non-literal concepts, kinetic art, and stylized visual loops.'
  },
  'AI Avatar & Character': {
    description: 'Character-centric prompts for digital avatars and persona-driven content.',
    intent: 'Prompts for talking avatars, character performances, and identity-led narratives.'
  },
  'Sci-Fi & Concept Film': {
    description: 'Concept-heavy prompts for futuristic worlds and speculative visual fiction.',
    intent: 'Prompts for sci-fi scenes, future tech visuals, and cinematic concept pieces.'
  },
  'Food & Cooking': {
    description: 'Food-focused prompts for recipe visuals, culinary branding, and table aesthetics.',
    intent: 'Prompts for cooking sequences, macro food shots, and restaurant-style storytelling.'
  },
  'Real Estate & Architecture': {
    description: 'Spatial prompts for property showcases and architectural visualization.',
    intent: 'Prompts for walkthroughs, exterior reveals, and design-focused property narratives.'
  }
}

const FALLBACK_TOOL = 'Runway'

const toSlug = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const normalizeWhitespace = (value) => String(value || '').replace(/\s+/g, ' ').trim()

const deriveTitle = (videoPrompt) => {
  const normalized = normalizeWhitespace(videoPrompt)
  if (!normalized) return 'Untitled Prompt'
  const firstClause = normalized.split(/[.,]/)[0].trim()
  if (firstClause.length <= 72) return firstClause
  return `${firstClause.slice(0, 69).trim()}...`
}

const dedupeKeepFirst = (values) => {
  const seen = new Set()
  const output = []
  for (const rawValue of values) {
    const value = normalizeWhitespace(rawValue)
    if (!value) continue
    const key = value.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    output.push(value)
  }
  return output
}

const orderedCategories = (() => {
  const found = [...new Set(rawPromptLibrary.map((prompt) => prompt.category))]
  return found.sort((left, right) => {
    const leftIndex = CATEGORY_ORDER.indexOf(left)
    const rightIndex = CATEGORY_ORDER.indexOf(right)
    const normalizedLeft = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex
    const normalizedRight = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex
    if (normalizedLeft !== normalizedRight) return normalizedLeft - normalizedRight
    return left.localeCompare(right)
  })
})()

export const PROMPT_LIBRARY = rawPromptLibrary.map((rawPrompt, index) => {
  const bestOn = Array.isArray(rawPrompt.best_on) ? dedupeKeepFirst(rawPrompt.best_on) : []
  const audience = Array.isArray(rawPrompt.audience) ? dedupeKeepFirst(rawPrompt.audience) : []
  const style = normalizeWhitespace(rawPrompt.style)
  const videoPrompt = normalizeWhitespace(rawPrompt.video_prompt)
  const imagePrompt = normalizeWhitespace(rawPrompt.image_prompt)
  const sfxPrompt = normalizeWhitespace(rawPrompt.sfx_prompt)

  return {
    id: index + 1,
    source_id: rawPrompt.source_id ?? rawPrompt.id,
    category: normalizeWhitespace(rawPrompt.category),
    style,
    audience,
    best_on: bestOn,
    image_prompt: imagePrompt,
    video_prompt: videoPrompt,
    sfx_prompt: sfxPrompt,
    variables: rawPrompt.variables || {},
    tool_notes: normalizeWhitespace(rawPrompt.tool_notes),
    title: deriveTitle(videoPrompt),
    tool: bestOn[0] || FALLBACK_TOOL,
    prompt: videoPrompt,
    tags: dedupeKeepFirst([style, ...bestOn, ...audience])
  }
})

export const PROMPT_CATEGORY_PAGES = orderedCategories.map((category) => {
  const fallbackDescription = `Curated ${category.toLowerCase()} prompts for AI video workflows.`
  const fallbackIntent = `Copy-ready ${category.toLowerCase()} prompt structures for filmmakers and creators.`
  const categoryPrompts = PROMPT_LIBRARY.filter((prompt) => prompt.category === category)
  const meta = CATEGORY_METADATA[category] || {}

  return {
    slug: toSlug(category),
    name: category,
    description: meta.description || fallbackDescription,
    intent: meta.intent || fallbackIntent,
    promptIds: categoryPrompts.map((prompt) => prompt.id)
  }
})

export const PROMPT_CATEGORY_SLUGS = PROMPT_CATEGORY_PAGES.map((category) => category.slug)
