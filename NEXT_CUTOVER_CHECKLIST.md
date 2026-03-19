# Next.js Cutover Checklist

## Current status

The `codex/nextjs-phase1` branch now covers the main public and private routes that matter most for SEO and user flow:

- `/`
- `/prompt-enhancer`
- `/prompts`
- `/prompts/[categorySlug]`
- `/shot-to-prompt`
- `/camera-moves`
- `/pricing`
- `/sign-in`
- `/my-library`
- `/settings`
- `/story-flow`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/success`

## Remaining route parity gaps

Route parity is now much closer. The major public/private routes from the current Vite app are present in `next-app/`.

Remaining parity work is now more about behavior polish than missing route files, for example:

- final content review on support/legal pages
- real success-page flow testing after Stripe checkout
- any smaller route details we discover during preview-deployment QA

## Metadata and crawlability

Before cutover:

- Verify each public Next route has correct metadata in page source, not just after hydration
- Confirm `robots` behavior:
  - public routes indexable
  - private routes noindex
- Check category-page canonicals under `/prompts/[categorySlug]`
- Confirm the default OG image is still valid and current

## Functional checks

Run through these on the Next deployment candidate:

- Homepage loads and matches the new hierarchy
- Prompt Enhancer works end-to-end against `/.netlify/functions/enhance-prompt`
- Shot to Prompt works for image and short single-shot video uploads
- Prompt Vault:
  - search works
  - category and style filters work
  - variable swapping works
  - save-to-library works for signed-in users
- My Library:
  - fetches saved prompts
  - copy works
  - delete works
- Settings:
  - display name update works
  - password update works
  - sign out works
- Story Flow:
  - signed-out gate works
  - Pro gate works
  - each planner step works

## Environment and deployment checks

Make sure the Next deployment target has:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- all existing Netlify function secrets still configured:
  - `ANTHROPIC_API_KEY`
  - Stripe keys
  - any Supabase service-role/server keys already used by functions

Also confirm:

- Netlify is pointed at `next-app/` as the base directory for the cutover candidate
- Next is deployed with a Netlify-compatible Next runtime
- `/.netlify/functions/*` requests still resolve correctly from the deployed Next frontend
- direct refresh works on all migrated routes

## Cutover recommendation

Do **not** cut over yet if any of these are still incomplete:

- missing legal/support routes
- broken save-to-library behavior
- broken auth redirect behavior
- metadata mismatch on public routes
- deployment/runtime mismatch between Next frontend and Netlify functions

## Recommended final sequence

1. Smoke-test all public and private flows on a Next preview deployment
2. Confirm metadata and robots behavior using page source
3. Verify Netlify branch config and environment variables against `next-app/`
4. Switch primary deployment to the Next app
5. Keep the Vite app available briefly as rollback insurance
