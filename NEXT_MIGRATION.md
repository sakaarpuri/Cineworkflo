# Next.js Migration Status

## Phase 1 started

This branch adds a parallel Next.js App Router foundation in `next-app/` without removing the current Vite app.

### Added
- dedicated `next-app/` workspace for the migration
- its own App Router layout and initial route shells
- independent Next package/scripts so the current Vite app stays untouched
- homepage shell using the current CineWorkflo hierarchy:
  - Hero
  - Shot to Prompt
  - Prompt Enhancer
  - Prompt Vault
  - Camera Moves
- richer public SEO shells for:
  - `/shot-to-prompt`
  - `/prompt-enhancer`
  - `/prompts`
  - `/prompts/[categorySlug]`
- working Next client version of `Shot to Prompt`
  - same Netlify `/.netlify/functions/shot-to-prompt` endpoint
  - same image/video upload rules
  - same structured output shape (`title`, `image_prompt`, `video_prompt`, `tool_notes`)
  - direct Supabase session lookup inside the client component for anonymous/pro access handling
- working Next client version of `Prompt Enhancer`
  - same Netlify `/.netlify/functions/enhance-prompt` endpoint
  - same mood, use-case, and style preset logic
  - same essential/pro level split, image toggle, SFX toggle, and interpretation passes
  - shared free/pro monthly usage behavior with Shot to Prompt

### Current intent
- Keep the existing Vite app at repo root as the live source of truth during migration
- Port public routes into Next incrementally
- Keep current Netlify functions, Supabase auth, and Stripe backend unchanged in Phase 1

### Current focus
- Replace placeholder public pages with migration-ready public shells that already reflect the real CineWorkflo product story
- Move the most important public workflows one by one, starting with reference-first and idea-first tools

### Recommended next step
- Port the next public workflow surface into Next, starting with:
  1. Prompt Vault grid/search/filter behavior
  2. shared SEO metadata helpers
  3. eventual auth/provider consolidation inside `next-app`
  4. final homepage redesign implementation inside Next

### Current commands
- `cd next-app && npm install`
- `cd next-app && npm run dev`
- `cd next-app && npm run build`

### Validation
- `next-app` currently builds successfully with static routes for:
  - `/`
  - `/prompt-enhancer`
  - `/prompts`
  - `/prompts/[categorySlug]`
  - `/shot-to-prompt`
  - `/camera-moves`
  - `/pricing`
