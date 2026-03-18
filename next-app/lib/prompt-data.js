export const CATEGORY_PAGES = [
  {
    name: 'Brand & Product Ads',
    slug: 'brand-and-product-ads',
    description: 'Commercial prompt structures for high-conversion brand and product videos.',
    count: 34,
    accent: '#F59E0B',
  },
  {
    name: 'Social & Short-Form Content',
    slug: 'social-and-short-form-content',
    description: 'Fast, scroll-stopping prompts designed for short-form social formats.',
    count: 20,
    accent: '#10B981',
  },
  {
    name: 'Cinematic & Storytelling',
    slug: 'cinematic-and-storytelling',
    description: 'Narrative-focused prompts with cinematic camera language and pacing.',
    count: 29,
    accent: '#3B82F6',
  },
  {
    name: 'World & Environment Building',
    slug: 'world-and-environment-building',
    description: 'Environment-first prompts for immersive locations and world scale.',
    count: 37,
    accent: '#14B8A6',
  },
  {
    name: 'Abstract & Motion Art',
    slug: 'abstract-and-motion-art',
    description: 'Experimental prompts built around motion design and abstract visuals.',
    count: 26,
    accent: '#8B5CF6',
  },
  {
    name: 'AI Avatar & Character',
    slug: 'ai-avatar-and-character',
    description: 'Character-centric prompts for digital avatars and persona-driven content.',
    count: 33,
    accent: '#EC4899',
  },
  {
    name: 'Sci-Fi & Concept Film',
    slug: 'sci-fi-and-concept-film',
    description: 'Concept-heavy prompts for futuristic worlds and speculative visual fiction.',
    count: 51,
    accent: '#6366F1',
  },
  {
    name: 'Food & Cooking',
    slug: 'food-and-cooking',
    description: 'Food-focused prompts for recipe visuals, culinary branding, and table aesthetics.',
    count: 40,
    accent: '#F97316',
  },
  {
    name: 'Real Estate & Architecture',
    slug: 'real-estate-and-architecture',
    description: 'Spatial prompts for property showcases and architectural visualization.',
    count: 28,
    accent: '#78716C',
  },
  {
    name: 'Nature & Wildlife Documentary',
    slug: 'nature-and-wildlife-documentary',
    description: 'Wildlife and environment prompts for documentary-style observation and habitat storytelling.',
    count: 20,
    accent: '#22C55E',
  },
]

export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORY_PAGES.map((item) => [item.slug, item]))

export const FEATURED_VAULT_CARDS = [
  {
    id: 247,
    title: 'Stepwell descent',
    category: 'Cinematic & Storytelling',
    description: 'Architectural scale, warm light, subject isolation, and camera-ready detail for narrative still-to-motion workflows.',
  },
  {
    id: 248,
    title: 'Alien planet survivor portrait',
    category: 'Sci-Fi & Concept Film',
    description: 'Character-first sci-fi prompt design with costume detail, survival mood, and clear motion continuity.',
  },
  {
    id: 249,
    title: 'Mustang desert drive',
    category: 'Brand & Product Ads',
    description: 'Commercial-grade vehicle language with environmental scale, raking sidelight, and shot-ready detail.',
  },
]

export const FEATURED_MOODS = ['Epic', 'Dreamlike', 'Tense', 'Whimsical']

export const FEATURED_USE_CASES = ['Storytelling', 'Brand Ad', 'Short-form', 'Documentary']

export const FEATURED_STYLE_PRESETS = [
  {
    key: 'desert-minimalism',
    label: 'Desert Minimalism',
    subtitle: 'Villeneuve / Deakins',
    accent: '#C08A4D',
  },
  {
    key: 'humid-neon-noir',
    label: 'Humid Neon Noir',
    subtitle: 'Wong Kar-wai / Doyle',
    accent: '#D14B7E',
  },
  {
    key: 'golden-hour-immersion',
    label: 'Golden Hour Immersion',
    subtitle: 'Malick / Lubezki',
    accent: '#D4A64A',
  },
  {
    key: 'pastel-symmetry',
    label: 'Pastel Symmetry',
    subtitle: 'Wes Anderson',
    accent: '#D7A9B8',
  },
]

export const EXTRA_STYLE_PRESET_NAMES = ['Nordic Noir', 'Dreamscape', 'Tokyo Night Drift']

export const SHOT_TO_PROMPT_BENEFITS = [
  'Decode one strong shot into a ready-to-use prompt pair.',
  'Use movie stills, ad frames, or short single-shot clips as references.',
  'Preserve visual identity while adding motion-aware camera language.',
]

export const SHOT_TO_PROMPT_FAQS = [
  {
    question: 'What happens when I upload video?',
    answer:
      'Video stays a single-shot workflow. We sample three key moments from one continuous clip to infer subject motion, camera behavior, and pacing, then return one image prompt and one motion-aware video prompt.',
  },
  {
    question: 'Does this break down a full edit into scenes?',
    answer:
      'Not in v1. The goal is clarity: one shot in, one strong prompt pair out. Multi-scene parsing would be a separate workflow later.',
  },
  {
    question: 'What should I do after generation?',
    answer:
      'Refine the result in Prompt Enhancer, then pull matching styles or references from Prompt Vault before moving into image-to-video tools.',
  },
]
