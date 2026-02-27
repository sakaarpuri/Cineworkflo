# Cineworkflo SEO Roadmap (90 Days)

## Goals
- Increase qualified organic traffic to product pages.
- Improve rankings for AI video prompt and camera movement intents.
- Improve organic-to-signup and organic-to-checkout conversion.

## Success Metrics
- Indexed pages count (Google Search Console).
- Non-brand organic clicks and impressions.
- CTR on top landing pages.
- Average rank for priority query set.
- Organic conversion rate (signup, paid checkout).
- Crawl health: 404 count, redirect errors, excluded pages.

---

## Phase 1: Technical SEO Foundation (Days 1-30)

### Week 1: URL Canonicalization + Redirect Hygiene
Tasks:
- Enforce one canonical URL per page.
- Ensure legacy URLs 301 to current routes where needed.
- Remove dead redirects that point to deleted static pages.
- Decide if `/modern-moves` is a public page or a demo page (indexable vs `noindex`).

File Targets:
- `netlify.toml`
- `src/App.jsx`
- `src/components/Header.jsx`
- `src/components/Footer.jsx`

Definition of Done:
- No duplicate route variants indexed.
- Redirect map reflects current live routes only.

### Week 2: Crawlability + Renderability
Tasks:
- Validate `robots.txt` rules.
- Ensure sitemap only contains live URLs.
- Ensure key pages render crawlable HTML (prerender/SSR strategy for key routes).
- Ensure social crawlers see usable metadata without client JS (fallback meta in `index.html`).

File Targets:
- `public/robots.txt`
- `public/sitemap.xml`
- `index.html`

Definition of Done:
- GSC accepts sitemap without errors.
- Core routes are inspectable with complete content.

### Week 3: Metadata + Structured Data
Tasks:
- Add unique title/meta/description/canonical per indexable route.
- Add JSON-LD for `WebSite`, `SoftwareApplication`, `BreadcrumbList`, and `Organization` (or `Brand`) where appropriate.
- Add `og:image` and `twitter:image` for key routes.
- Add `FAQPage` schema only when visible FAQ content exists.

File Targets:
- `src/App.jsx`
- `index.html`
- Route/page components under `src/pages/` and key sections in `src/components/`

Definition of Done:
- Every indexable page has unique metadata.
- Rich result test passes for structured data.

### Week 4: Performance Baseline
Tasks:
- Improve LCP: optimize hero media and image sizes.
- Improve CLS: reserve dimensions for media blocks.
- Improve INP: reduce heavy client-side JS on entry pages.
- Ensure fonts do not block first render (preload/non-blocking strategy).

File Targets:
- `src/components/HeroGallery.jsx`
- `src/components/PromptEnhancer.jsx`
- `src/components/ShotToPrompt.jsx`
- `src/components/CameraMoveCards/`
- `vite.config.js`

Definition of Done:
- Core Web Vitals trending to "Good" for main landing pages.

---

## Phase 2: Content Architecture + Topic Clusters (Days 31-60)

### Week 5: Keyword Map + Page Intent Map
Tasks:
- Define target query clusters per route.
- Assign one primary intent per page (avoid keyword cannibalization).

Primary Route Map:
- `/` -> brand + product overview intent
- `/prompts` -> prompt library intent
- `/shot-to-prompt` -> tool workflow intent
- `/camera-moves` -> educational/tutorial intent
- pricing section (`/#pricing`) -> transactional intent (conversion optimization, not a standalone SEO route unless you add `/pricing`)
- `/modern-moves` -> optional; either indexable modern-move education or keep as `noindex` demo

Artifacts:
- Add `docs/seo/keyword-map.md` (or similar internal file).

### Week 6: Prompt Hub Expansion
Tasks:
- Create category pages and use-case landing pages for prompts.
- Add supporting copy with examples and clear CTA blocks.
- Avoid thin pages: only ship new routes if each page has unique copy, examples, and internal links.

File Targets:
- `src/components/PromptVault.jsx` (or route equivalent)
- Data files in `src/data/` for category-driven content

Definition of Done:
- New indexable pages with unique copy and internal links.

### Week 7: Shot-to-Prompt SEO Layer
Tasks:
- Add educational sections: "how it works", "best inputs", "common mistakes".
- Add FAQ block and FAQ schema where appropriate.

File Targets:
- `src/components/ShotToPrompt.jsx`

Definition of Done:
- Route targets both tool intent and long-tail tutorial intent.

### Week 8: Internal Linking Pass
Tasks:
- Add contextual links between prompts, shot-to-prompt, camera-moves, and pricing.
- Add route-level breadcrumbs where useful.
- Add "next step" CTAs on education pages (apply moves in prompts, generate from reference, etc.).

File Targets:
- `src/components/Header.jsx`
- `src/components/Footer.jsx`
- `src/pages/CameraMovesPage.jsx`
- `src/components/CameraMoveCards/index.jsx`
- `src/components/PromptVault.jsx`

Definition of Done:
- All major pages link to at least 2 related pages and 1 conversion path.

---

## Phase 3: Authority + Conversion SEO (Days 61-90)

### Week 9: Link Acquisition Sprint
Tasks:
- Publish 3-5 high-value tutorials/case studies.
- Outreach to creator communities and AI filmmaking newsletters.

Non-code:
- Marketing content and partnerships.

### Week 10: Trust + Entity Signals
Tasks:
- Improve About, Contact, and policy pages.
- Clarify product positioning and team credibility.

File Targets:
- Footer links and legal/info pages once added in app routes.

### Week 11: CTR Optimization
Tasks:
- Use GSC to identify high-impression/low-CTR pages.
- Rewrite titles/meta and test variants every 2 weeks.

File Targets:
- Route-level metadata config/components.

### Week 12: Conversion SEO
Tasks:
- Tighten organic landing page CTAs.
- Add social proof where available.
- Measure organic-assisted conversion paths.

File Targets:
- `src/components/Pricing.jsx`
- `src/components/HeroGallery.jsx`
- `src/components/PromptEnhancer.jsx`

---

## Prerender/SSR Decision (Explicit)

Goal: ensure Google and non-JS crawlers reliably see content for key routes.

Option A (No new framework, minimal changes):
- Prerender static HTML snapshots for:
  - `/`
  - `/prompts`
  - `/shot-to-prompt`
  - `/camera-moves`
- Keep app as Vite SPA for interactive use.

Option B (Framework upgrade):
- Move public marketing/education routes to SSR/SSG (Astro/Next/Remix).
- Keep Netlify Functions (Anthropic/Stripe) and the existing app logic.

Definition of Done:
- GSC URL Inspection shows rendered text for core routes without requiring client execution.

---

## Technical Backlog (Prioritized)

P0:
- Route-level metadata system (unique title/description/canonical).
- Sitemap automation from live routes/content data.
- Structured data implementation.
- OG images for main routes.

P1:
- Prerender/SSR for top public routes.
- Internal linking automation for prompt/category pages.

P2:
- Programmatic SEO pages for long-tail prompt intents with quality control.

---

## Reporting Cadence

Weekly:
- Index coverage, clicks, CTR, top queries, top pages, 404/redirect errors.
- Organic landing page funnel (visit -> CTA -> signup -> purchase).

Monthly:
- Ranking movement by query cluster.
- Organic conversion performance by landing page.
- Content refresh decisions (expand, merge, prune).

---

## Current Route Checklist

- `/`:
  - [ ] Unique metadata
  - [ ] Structured data
  - [ ] Social preview (`og:image`)
  - [ ] Performance pass
  - [ ] Internal links to `/prompts`, `/shot-to-prompt`, `/camera-moves`

- `/prompts`:
  - [ ] Category architecture
  - [ ] FAQ block/schema
  - [ ] Social preview (`og:image`)
  - [ ] Conversion CTA tests

- `/shot-to-prompt`:
  - [ ] Educational content sections
  - [ ] FAQ schema
  - [ ] Social preview (`og:image`)
  - [ ] Internal links to prompt categories

- `/camera-moves`:
  - [ ] Unique metadata for page intent
  - [ ] Internal links to prompt workflows
  - [ ] Structured data (breadcrumb + educational intent)
  - [ ] Social preview (`og:image`)

- Pricing / checkout flows:
  - [ ] Crawl-safe metadata
  - [ ] No indexing of private/sensitive states
  - [ ] Conversion tracking by source/medium
