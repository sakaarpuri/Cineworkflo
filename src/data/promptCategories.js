export const CATEGORY_COLORS = {
  'Product Demo': '#3B82F6',
  'B-Roll': '#F59E0B',
  Interview: '#10B981',
  'Motion Graphics': '#06B6D4',
  Transition: '#8B5CF6'
}

export const PROMPT_LIBRARY = [
  {
    id: 1,
    title: 'Cinematic Product Rotation',
    category: 'Product Demo',
    tool: 'Runway',
    prompt: 'Cinematic product shot, rotating 360° on seamless black background, studio lighting with soft reflections, shallow depth of field, 8K quality, motion blur on rotation, professional commercial aesthetic',
    tags: ['product', 'commercial', 'rotation']
  },
  {
    id: 2,
    title: 'Smooth Aerial Drone Shot',
    category: 'B-Roll',
    tool: 'Pika',
    prompt: 'Aerial drone footage, smooth gliding motion over landscape, golden hour lighting, cinematic color grade, slight lens flare, professional travel documentary style, 4K resolution',
    tags: ['drone', 'landscape', 'travel']
  },
  {
    id: 3,
    title: 'Dramatic Lighting Portrait',
    category: 'Interview',
    tool: 'Runway',
    prompt: 'Dramatic interview lighting, Rembrandt style, subject looking slightly off-camera, shallow depth of field, film grain texture, cinematic mood, dark background with rim light',
    tags: ['interview', 'portrait', 'dramatic']
  },
  {
    id: 4,
    title: 'Seamless Loop Background',
    category: 'Motion Graphics',
    tool: 'Runway',
    prompt: 'Abstract flowing particles, seamless loop, soft gradients in teal and coral, gentle organic motion, perfect for text overlay, 4K, smooth 60fps',
    tags: ['background', 'loop', 'abstract']
  },
  {
    id: 5,
    title: 'Handheld Documentary Style',
    category: 'B-Roll',
    tool: 'Pika',
    prompt: 'Handheld camera movement, subtle shake, following subject through environment, natural lighting, documentary style, authentic feel, slight motion blur on edges',
    tags: ['handheld', 'documentary', 'natural']
  },
  {
    id: 6,
    title: 'Luxury Product Showcase',
    category: 'Product Demo',
    tool: 'Runway',
    prompt: 'Luxury product cinematography, slow push-in movement, dramatic rim lighting on black background, shallow depth of field, premium aesthetic, reflections on glossy surface, high-end commercial',
    tags: ['luxury', 'product', 'premium']
  },
  {
    id: 7,
    title: 'Streetwear Drop Teaser',
    category: 'Product Demo',
    tool: 'Kling',
    prompt: 'Urban fashion product teaser, gritty night alley, dramatic edge lighting, quick push-ins and close-up fabric texture reveals, high-contrast commercial style, social ad pacing',
    tags: ['streetwear', 'ad', 'teaser']
  },
  {
    id: 8,
    title: 'Vertical Social Hook Shot',
    category: 'Transition',
    tool: 'Luma',
    prompt: '9:16 social-first opener, quick subject reveal with whip pan transition, bright practical lights, punchy high-saturation grade, thumb-stopping composition for short-form video',
    tags: ['short-form', 'vertical', 'hook']
  },
  {
    id: 9,
    title: 'Fantasy City Establishing',
    category: 'Motion Graphics',
    tool: 'Runway',
    prompt: 'Epic fantasy city at dawn, layered atmospheric fog, slow drone rise and pullback revealing scale, cinematic world-building tone, volumetric light and rich environmental detail',
    tags: ['world-building', 'fantasy', 'establishing']
  }
]

export const PROMPT_CATEGORY_PAGES = [
  {
    slug: 'product-ads',
    name: 'Product Ads',
    intent: 'Commercial product storytelling with conversion-focused visuals.',
    description: 'Use these prompts for premium ad-style product shots, launch teasers, and feature highlight sequences.',
    promptIds: [1, 6, 7]
  },
  {
    slug: 'short-form-social',
    name: 'Short-Form Social',
    intent: 'Fast, high-impact prompt structures for vertical and short social formats.',
    description: 'Designed for hooks, motion-heavy transitions, and creator-style pacing in short social videos.',
    promptIds: [8, 5, 3]
  },
  {
    slug: 'cinematic-storytelling',
    name: 'Cinematic Storytelling',
    intent: 'Narrative scene prompts with mood, lens language, and shot progression.',
    description: 'Use for dramatic scenes, interview-driven storytelling, and cinematic pacing.',
    promptIds: [3, 2, 5]
  },
  {
    slug: 'world-building',
    name: 'World Building',
    intent: 'Environment and atmosphere-first prompts for scale and immersion.',
    description: 'Built for establishing shots, world reveals, and location mood design.',
    promptIds: [9, 2, 4]
  }
]

export const PROMPT_CATEGORY_SLUGS = PROMPT_CATEGORY_PAGES.map((category) => category.slug)
