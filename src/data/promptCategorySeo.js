const CATEGORY_METADATA = {
  'Brand & Product Ads': {
    description: 'Commercial prompt structures for high-conversion brand and product videos.',
  },
  'Social & Short-Form Content': {
    description: 'Fast, scroll-stopping prompts designed for short-form social formats.',
  },
  'Cinematic & Storytelling': {
    description: 'Narrative-focused prompts with cinematic camera language and pacing.',
  },
  'World & Environment Building': {
    description: 'Environment-first prompts for immersive locations and world scale.',
  },
  'Abstract & Motion Art': {
    description: 'Experimental prompts built around motion design and abstract visuals.',
  },
  'AI Avatar & Character': {
    description: 'Character-centric prompts for digital avatars and persona-driven content.',
  },
  'Sci-Fi & Concept Film': {
    description: 'Concept-heavy prompts for futuristic worlds and speculative visual fiction.',
  },
  'Food & Cooking': {
    description: 'Food-focused prompts for recipe visuals, culinary branding, and table aesthetics.',
  },
  'Real Estate & Architecture': {
    description: 'Spatial prompts for property showcases and architectural visualization.',
  },
}

const toSlug = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const PROMPT_CATEGORY_SEO_PAGES = Object.entries(CATEGORY_METADATA).map(([name, meta]) => ({
  name,
  slug: toSlug(name),
  description: meta.description,
}))

export const PROMPT_CATEGORY_SEO_BY_SLUG = Object.fromEntries(
  PROMPT_CATEGORY_SEO_PAGES.map((item) => [item.slug, item])
)
