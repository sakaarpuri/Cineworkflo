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
  - `/prompts`
  - `/prompts/[categorySlug]`
- working Next client version of `Shot to Prompt`
  - same Netlify `/.netlify/functions/shot-to-prompt` endpoint
  - same image/video upload rules
  - same structured output shape (`title`, `image_prompt`, `video_prompt`, `tool_notes`)
  - direct Supabase session lookup inside the client component for anonymous/pro access handling

### Current intent
- Keep the existing Vite app at repo root as the live source of truth during migration
- Port public routes into Next incrementally
- Keep current Netlify functions, Supabase auth, and Stripe backend unchanged in Phase 1

### Current focus
- Replace placeholder public pages with migration-ready public shells that already reflect the real CineWorkflo product story
- Move the most important public workflows one by one, starting with reference-first tools

### Recommended next step
- Port the next interactive public tools into Next, starting with:
  1. Prompt Enhancer client workflow
  2. Prompt Vault grid/search/filter behavior
  3. shared SEO metadata helpers
  4. eventual auth/provider consolidation inside `next-app`

### Current commands
- `cd next-app && npm install`
- `cd next-app && npm run dev`
- `cd next-app && npm run build`

### Validation
- `next-app` currently builds successfully with static routes for:
  - `/`
  - `/prompts`
  - `/prompts/[categorySlug]`
  - `/shot-to-prompt`
  - `/camera-moves`
  - `/pricing`
