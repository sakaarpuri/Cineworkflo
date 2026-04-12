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

export const FEATURED_VAULT_CARD_IDS = [53, 101, 280, 320]

export const FEATURED_MOODS = ['Epic', 'Dreamlike', 'Tense', 'Whimsical']
export const FEATURED_USE_CASES = ['Storytelling', 'Brand Ad', 'Short-form', 'Documentary']

export const FEATURED_STYLE_PRESETS = [
  { key: 'desert-minimalism', label: 'Desert Minimalism', subtitle: 'Villeneuve / Deakins', accent: '#C08A4D' },
  { key: 'humid-neon-noir', label: 'Humid Neon Noir', subtitle: 'Wong Kar-wai / Doyle', accent: '#D14B7E' },
  { key: 'golden-hour-immersion', label: 'Golden Hour Immersion', subtitle: 'Malick / Lubezki', accent: '#D4A64A' },
  { key: 'pastel-symmetry', label: 'Pastel Symmetry', subtitle: 'Wes Anderson', accent: '#D7A9B8' },
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

export const PLATFORM_BADGES = [
  { label: 'Runway', tone: 'neutral' },
  { label: 'Pika', tone: 'neutral' },
  { label: 'Sora', tone: 'neutral' },
  { label: 'Kling', tone: 'neutral' },
  { label: 'Luma', tone: 'neutral' },
  { label: 'Veo', tone: 'new' },
  { label: 'Grok', tone: 'new' },
  { label: 'Higgsfield', tone: 'neutral' },
  { label: 'Seedance', tone: 'neutral' },
]

export const HOME_CAMERA_MOVES = [
  {
    key: 'dolly',
    title: 'Dolly',
    tag: 'push in / pull back',
    badge: 'CLASSIC MOVE',
    badgeType: 'classic',
    description: 'The camera physically moves forward or backward on a track. Unlike zoom, perspective genuinely shifts.',
    feelText: 'Walking into the scene. Builds intimacy, tension, or a slow reveal.',
    prompts: ['slow dolly in toward subject', 'camera pushes forward on a track', 'cinematic push into close-up'],
  },
  {
    key: 'tracking',
    title: 'Tracking Shot',
    tag: 'follow sideways',
    badge: 'CLASSIC MOVE',
    badgeType: 'classic',
    description: 'Camera and subject move together sideways at the same speed, keeping the subject perfectly framed.',
    feelText: 'Running alongside someone. Keeps energy and the subject always centred in frame.',
    prompts: ['tracking shot following subject', 'camera moves parallel sideways', 'side-on tracking as character walks'],
  },
  {
    key: 'handheld',
    title: 'Handheld',
    tag: 'smooth / natural',
    badge: 'DYNAMIC / CINEMATIC',
    badgeType: 'dynamic',
    description: 'A handheld camera has subtle, organic drift from breathing, footsteps, and micro-corrections.',
    feelText: 'Present and personal. Adds realism, tension, and immediacy.',
    prompts: ['handheld camera', 'smooth natural micro-drift', 'human-operated', 'subtle breathing sway'],
  },
]

export const TESTIMONIALS = [
  {
    quote: 'Shot to Prompt gets me from a film still to usable prompt language faster than anything else I have tried.',
    name: 'Indie director',
    role: 'Short-form filmmaker',
  },
  {
    quote: 'Prompt Enhancer feels like having a cinematography-minded writing partner instead of a generic AI helper.',
    name: 'Creative strategist',
    role: 'Brand film workflow',
  },
  {
    quote: 'The Vault is actually curated. It feels more like a working reference library than prompt spam.',
    name: 'AI video creator',
    role: 'Commercial and concept work',
  },
]
