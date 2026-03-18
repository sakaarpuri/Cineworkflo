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

### Current intent
- Keep the existing Vite app at repo root as the live source of truth during migration
- Port public routes into Next incrementally
- Keep current Netlify functions, Supabase auth, and Stripe backend unchanged in Phase 1

### Recommended next step
- Port the real homepage sections into Next client/server components, starting with:
  1. Hero
  2. Shot to Prompt section shell
  3. Prompt Enhancer section shell

### Current commands
- `cd next-app && npm install`
- `cd next-app && npm run dev`
- `cd next-app && npm run build`

### Validation
- `next-app` currently builds successfully with static routes for:
  - `/`
  - `/prompts`
  - `/shot-to-prompt`
  - `/camera-moves`
  - `/pricing`
