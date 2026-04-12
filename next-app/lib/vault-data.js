import rawPromptLibrary from '../data/ai_video_prompt_library.json'

export const CATEGORY_ORDER = [
  'Brand & Product Ads',
  'Social & Short-Form Content',
  'Cinematic & Storytelling',
  'World & Environment Building',
  'Abstract & Motion Art',
  'AI Avatar & Character',
  'Sci-Fi & Concept Film',
  'Food & Cooking',
  'Real Estate & Architecture',
  'Nature & Wildlife Documentary',
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
  'Real Estate & Architecture': '#78716C',
  'Nature & Wildlife Documentary': '#22C55E',
}

const CATEGORY_METADATA = {
  'Brand & Product Ads': {
    description: 'Commercial prompt structures for high-conversion brand and product videos.',
    intent: 'Prompts for product reveals, brand films, and ad-ready visual storytelling.',
  },
  'Social & Short-Form Content': {
    description: 'Fast, scroll-stopping prompts designed for short-form social formats.',
    intent: 'Prompts for creator-style hooks, vertical edits, and high-retention short videos.',
  },
  'Cinematic & Storytelling': {
    description: 'Narrative-focused prompts with cinematic camera language and pacing.',
    intent: 'Prompts for dramatic scenes, storytelling arcs, and film-style visual sequences.',
  },
  'World & Environment Building': {
    description: 'Environment-first prompts for immersive locations and world scale.',
    intent: 'Prompts for establishing shots, atmospheric landscapes, and place-driven storytelling.',
  },
  'Abstract & Motion Art': {
    description: 'Experimental prompts built around motion design and abstract visuals.',
    intent: 'Prompts for non-literal concepts, kinetic art, and stylized visual loops.',
  },
  'AI Avatar & Character': {
    description: 'Character-centric prompts for digital avatars and persona-driven content.',
    intent: 'Prompts for talking avatars, character performances, and identity-led narratives.',
  },
  'Sci-Fi & Concept Film': {
    description: 'Concept-heavy prompts for futuristic worlds and speculative visual fiction.',
    intent: 'Prompts for sci-fi scenes, future tech visuals, and cinematic concept pieces.',
  },
  'Food & Cooking': {
    description: 'Food-focused prompts for recipe visuals, culinary branding, and table aesthetics.',
    intent: 'Prompts for cooking sequences, macro food shots, and restaurant-style storytelling.',
  },
  'Real Estate & Architecture': {
    description: 'Spatial prompts for property showcases and architectural visualization.',
    intent: 'Prompts for walkthroughs, exterior reveals, and design-focused property narratives.',
  },
  'Nature & Wildlife Documentary': {
    description: 'Wildlife and environment prompts for documentary-style observation and habitat storytelling.',
    intent: 'Prompts for animal behavior, habitat scale, and observational nature filmmaking.',
  },
}

const FALLBACK_TOOL = 'Runway'
const GENERATED_THUMBNAIL_IDS = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35,
  36, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66,
  67, 68, 69, 70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 81, 82, 84, 85, 86, 88, 90, 92, 93, 95, 96, 100, 101, 102, 103,
  104, 105, 108, 119, 121, 123, 124, 125, 126, 127, 128, 129, 135, 136, 137, 138, 141, 145, 146, 147, 151, 152, 154,
  155, 157, 158, 159, 160, 161, 162, 165, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181,
  208, 209, 213, 265, 266, 267, 268, 269, 280, 281, 282, 283, 284, 286, 287, 300, 302, 303, 304, 305, 306, 307, 308,
  309, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341,
  342, 343, 344, 345, 346, 347, 348, 349, 350, 353, 355, 359,
])

const toSlug = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const normalizeWhitespace = (value) => String(value || '').replace(/\s+/g, ' ').trim()
const normalizeKey = (value) => String(value || '').trim().toLowerCase()

const clampTitle = (value, max = 58) => {
  const normalized = normalizeWhitespace(value)
  if (!normalized) return 'Untitled Prompt'
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1).trim()}…`
}

const stripLensAndTech = (value) =>
  normalizeWhitespace(value)
    .replace(/\b\d{1,3}mm\b/gi, '')
    .replace(/\b(telephoto|macro)\b/gi, '')
    .replace(/\b(lens|framing|locked)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*[-—]\s*$/g, '')
    .trim()

const getVarDefault = (variables, ...keys) => {
  const byNormKey = new Map(
    Object.entries(variables || {}).map(([key, spec]) => [normalizeKey(key), normalizeWhitespace(spec?.default)]),
  )
  for (const key of keys) {
    const found = byNormKey.get(normalizeKey(key))
    if (found) return found
  }
  return ''
}

const buildPromptTitle = ({ title = '', variables = {}, image_prompt = '', video_prompt = '', category = '' }) => {
  const explicitTitle = normalizeWhitespace(title)
  if (explicitTitle) return clampTitle(explicitTitle)
  const product = getVarDefault(variables, 'product type')
  if (product) return clampTitle(`${stripLensAndTech(product)} ad`)
  const liquid = getVarDefault(variables, 'liquid or sauce')
  if (liquid) return clampTitle(`Slow-motion ${stripLensAndTech(liquid)} pour`)
  const city = getVarDefault(variables, 'futuristic city type')
  if (city) return clampTitle(`${stripLensAndTech(city)} descent`)
  const futureLocation = getVarDefault(variables, 'proposed future location')
  if (futureLocation) return clampTitle(`Documentary expedition: ${stripLensAndTech(futureLocation)}`)
  const property = getVarDefault(variables, 'property type')
  const impossible = getVarDefault(variables, 'impossible context', 'specific impossibility')
  if (property && impossible) return clampTitle(`${stripLensAndTech(property)} in ${stripLensAndTech(impossible)}`)
  const objectType = getVarDefault(variables, 'object type')
  const stimulus = getVarDefault(variables, 'stimulus')
  if (objectType && stimulus) return clampTitle(`${stripLensAndTech(objectType)} reacts to ${stripLensAndTech(stimulus)}`)
  if (objectType) return clampTitle(stripLensAndTech(objectType))
  const familiar = getVarDefault(variables, 'familiar object')
  const becomes = getVarDefault(variables, 'something else entirely')
  if (familiar && becomes) return clampTitle(`${stripLensAndTech(familiar)} becomes ${stripLensAndTech(becomes)}`)
  if (familiar) return clampTitle(`${stripLensAndTech(familiar)} transforms`)
  const character = getVarDefault(variables, 'character description', 'character type', 'person type', 'user type')
  const action = getVarDefault(variables, 'action', 'activity', 'specific task')
  if (character && action) return clampTitle(`${stripLensAndTech(character)} — ${stripLensAndTech(action)}`)
  if (character) return clampTitle(stripLensAndTech(character))
  const fallbackSource = normalizeWhitespace(image_prompt || video_prompt)
  if (fallbackSource) {
    const firstClause = fallbackSource.split(/[.]/)[0]
    return clampTitle(stripLensAndTech(firstClause))
  }
  return clampTitle(category || 'Prompt')
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
    id: rawPrompt.id ?? index + 1,
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
    title: buildPromptTitle({
      title: normalizeWhitespace(rawPrompt.title),
      variables: rawPrompt.variables || {},
      image_prompt: imagePrompt,
      video_prompt: videoPrompt,
      category: rawPrompt.category,
    }),
    tool: bestOn[0] || FALLBACK_TOOL,
    prompt: videoPrompt,
    tags: dedupeKeepFirst([style, ...bestOn, ...audience]),
    thumbnail_url: GENERATED_THUMBNAIL_IDS.has(Number(rawPrompt.id ?? index + 1))
      ? `/prompt-thumbnails/${String(rawPrompt.id ?? index + 1).padStart(3, '0')}.jpg`
      : null,
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
    promptIds: categoryPrompts.map((prompt) => prompt.id),
    count: categoryPrompts.length,
    accent: CATEGORY_COLORS[category] || '#2563eb',
  }
})

export const CATEGORY_BY_SLUG = Object.fromEntries(PROMPT_CATEGORY_PAGES.map((category) => [category.slug, category]))
export const PROMPT_CATEGORY_SLUGS = PROMPT_CATEGORY_PAGES.map((category) => category.slug)
