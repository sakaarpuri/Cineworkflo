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

### Current intent
- Keep the existing Vite app at repo root as the live source of truth during migration
- Port public routes into Next incrementally
- Keep current Netlify functions, Supabase auth, and Stripe backend unchanged in Phase 1

### Current focus
- Replace placeholder public pages with migration-ready public shells that already reflect the real CineWorkflo product story
- Keep interactive logic for later passes, but make the public routes useful for metadata, crawlability, and eventual section-by-section porting

### Recommended next step
- Port the real interactive public tools into Next client/server components, starting with:
  1. Shot to Prompt client workflow
  2. Prompt Enhancer client workflow
  3. Prompt Vault grid/search/filter behavior
  4. shared SEO metadata helpers

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
