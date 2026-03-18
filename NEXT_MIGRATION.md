# Next.js Migration Status

## Phase 1 started

This branch adds a parallel Next.js App Router foundation in `next-app/` without removing the current Vite app.

### Added
- dedicated `next-app/` workspace for the migration
- its own App Router layout and initial route shells
- independent Next package/scripts so the current Vite app stays untouched
- redesigned Next homepage following the current CineWorkFlo hierarchy and homepage spec:
  - Hero
  - Shot to Prompt
  - Prompt Enhancer
  - Prompt Vault
  - Camera Moves
  - Social Proof
  - Pricing
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
- working read-only Next client version of `Prompt Vault`
  - real library data copied into `next-app/data/ai_video_prompt_library.json`
  - real category routes driven from normalized vault data
  - real search, category/style filters, thumbnails, variable swapping, and copy actions
  - save-to-library internals intentionally deferred for a later pass
- shared Next auth provider inside `next-app`
  - Supabase session state now lives behind one provider instead of repeated route-local listeners
  - dedicated `/sign-in` route mirrors the current email/password signup and confirmation flow
- working Next client version of `My Library`
  - real `saved_prompts` fetch from Supabase
  - grouped prompt variants, copy actions, and delete actions
  - signed-out users are routed into the new Next sign-in flow
- auth-aware save flow inside the Next `Prompt Vault`
  - video prompts can now be saved directly from cards
  - expanded cards can save start-frame and end-frame variants into the same saved group
  - signed-out users now get a direct sign-in path instead of a dead-end save state
- working Next client version of `Story Flow`
  - hidden Pro-only route at `/story-flow`
  - same stage-based `/.netlify/functions/story-flow` backend
  - same one-minute planning flow: idea → treatment → variables → scenes → assets → prompt review
- working Next account settings page
  - dedicated `/settings` route for display name, password, and sign-out
  - mirrors the current Vite settings modal behavior

### Current intent
- Keep the existing Vite app at repo root as the live source of truth during migration
- Port public routes into Next incrementally
- Keep current Netlify functions, Supabase auth, and Stripe backend unchanged in Phase 1

### Current focus
- Replace placeholder public pages with migration-ready public surfaces that already reflect the real CineWorkFlo product story
- Move the most important public workflows one by one, starting with reference-first and idea-first tools, then the public discovery surface
- Implement the homepage redesign directly inside Next instead of redesigning the old Vite homepage first

### Recommended next step
- Move from route parity to refinement, starting with:
  1. shared SEO metadata helpers and richer per-route metadata
  2. final homepage redesign implementation inside Next
  3. any remaining private-page parity gaps
  4. final polish and cutover prep for the public/private route mix

### Current commands
- `cd next-app && npm install`
- `cd next-app && npm run dev`
- `cd next-app && npm run build`

### Validation
- `next-app` currently builds successfully with static and client-backed routes for:
  - `/`
  - `/my-library`
  - `/prompt-enhancer`
  - `/prompts`
  - `/prompts/[categorySlug]`
  - `/sign-in`
  - `/shot-to-prompt`
  - `/settings`
  - `/story-flow`
  - `/camera-moves`
  - `/pricing`
