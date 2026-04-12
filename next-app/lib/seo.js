const SITE_NAME = 'CineWorkflo'
const SITE_URL = 'https://cineworkflo.com'
const DEFAULT_OG_IMAGE = '/og-default.svg'

const DEFAULT_TITLE = 'CineWorkflo — Prompt Vault, Prompt Enhancer & Shot to Prompt for AI Video'
const DEFAULT_DESCRIPTION =
  'The prompt toolkit for AI filmmakers — Prompt Vault, Prompt Enhancer, Shot to Prompt, and Camera Moves for stronger image-to-video workflows.'

const buildAbsoluteUrl = (path = '/') => `${SITE_URL}${path === '/' ? '' : path}`

export const siteMetadataBase = new URL(SITE_URL)

export const buildSeoMetadata = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  noindex = false,
}) => {
  const canonical = buildAbsoluteUrl(path)

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

export const PAGE_SEO = {
  home: buildSeoMetadata({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
  }),
  promptEnhancer: buildSeoMetadata({
    title: 'Prompt Enhancer — Turn Ideas into Stronger AI Video Prompts | CineWorkflo',
    description:
      'Describe the shot in your head, then shape it with mood, cinematic style presets, and production-ready prompt detail.',
    path: '/prompt-enhancer',
  }),
  prompts: buildSeoMetadata({
    title: 'Prompt Vault — AI Video Prompts with Pro Controls | CineWorkflo',
    description:
      'Browse the Prompt Vault by category and style, then refine image prompts, video prompts, and variable-driven prompt controls.',
    path: '/prompts',
  }),
  shotToPrompt: buildSeoMetadata({
    title: 'Shot to Prompt — Turn a Frame into Image + Video Prompts | CineWorkflo',
    description:
      'Upload a frame or short single-shot clip and reverse-engineer both the still-image look and the motion language behind it.',
    path: '/shot-to-prompt',
  }),
  cameraMoves: buildSeoMetadata({
    title: 'Camera Moves — Cinematic Motion Language for AI Video | CineWorkflo',
    description:
      'Learn camera movement language for AI video workflows, from classic moves to modern AI-native motion patterns.',
    path: '/camera-moves',
  }),
  pricing: buildSeoMetadata({
    title: 'Pricing — CineWorkflo Plans for AI Video Creators',
    description:
      'Compare Free and Pro plans for Prompt Vault, Prompt Enhancer, Shot to Prompt, and the wider CineWorkflo workflow.',
    path: '/pricing',
  }),
  myLibrary: buildSeoMetadata({
    title: 'My Library — CineWorkflo',
    description: 'Access your saved CineWorkflo prompts, grouped variants, and prompt history.',
    path: '/my-library',
    noindex: true,
  }),
  signIn: buildSeoMetadata({
    title: 'Sign In — CineWorkflo',
    description: 'Sign in to CineWorkflo to access your Prompt Vault saves, Pro tools, and synced library.',
    path: '/sign-in',
    noindex: true,
  }),
  settings: buildSeoMetadata({
    title: 'Settings — CineWorkflo',
    description: 'Manage your CineWorkflo profile, password, and session settings.',
    path: '/settings',
    noindex: true,
  }),
  storyFlow: buildSeoMetadata({
    title: 'Story Flow Planner (Test) — CineWorkflo',
    description: 'Hidden Pro test route for turning one idea into a one-minute image-to-video production plan.',
    path: '/story-flow',
    noindex: true,
  }),
}

export const buildPromptCategoryMetadata = (category) =>
  buildSeoMetadata({
    title: `${category.name} AI Video Prompts | CineWorkflo`,
    description: `${category.description} Explore copy-ready prompts for ${category.name.toLowerCase()} workflows.`,
    path: `/prompts/${category.slug}`,
  })

export const CUTOVER_ROUTE_GAPS = []
