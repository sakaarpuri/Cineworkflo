# Cineworkflo Keyword + Intent Map (Phase 2 Week 5)

## Purpose
- Define one primary search intent per indexable route.
- Prevent keyword cannibalization between product, tool, and education pages.
- Align content and internal links with conversion paths.

## Current Indexable Route Inventory
- `https://cineworkflo.com/`
- `https://cineworkflo.com/prompts`
- `https://cineworkflo.com/shot-to-prompt`
- `https://cineworkflo.com/camera-moves`
- `https://cineworkflo.com/modern-moves` (optional: indexable or `noindex` demo)

---

## Route Intent Map

### 1) Home (`/`)
- Primary Intent: branded + commercial overview.
- Secondary Intent: "AI video prompts" category entry.
- SEO Role: category root and trust page, not deep tutorial content.
- Primary Cluster:
  - AI video prompts
  - professional AI video prompts
  - Runway and Pika prompts
- Supporting Cluster:
  - prompt library for filmmakers
  - cinematic prompt workflows
- Conversion Path:
  - `/` -> `/prompts`
  - `/` -> `/shot-to-prompt`
  - `/` -> pricing CTA

### 2) Prompt Vault (`/prompts`)
- Primary Intent: transactional/comparative prompt library intent.
- Secondary Intent: query filtering by style/tool/use case.
- SEO Role: core money page for prompt demand.
- Primary Cluster:
  - AI video prompt library
  - Runway prompt library
  - Pika prompts
  - cinematic prompts
- Supporting Cluster:
  - product ad prompts
  - social short form prompts
  - storyboard prompt packs
- Conversion Path:
  - `/prompts` -> checkout/pricing
  - `/prompts` -> `/shot-to-prompt` for custom generation

### 3) Shot to Prompt (`/shot-to-prompt`)
- Primary Intent: tool intent ("image/video frame to prompt").
- Secondary Intent: workflow/how-to intent.
- SEO Role: utility route targeting creator workflow queries.
- Primary Cluster:
  - shot to prompt
  - image to AI video prompt
  - reverse engineer video prompt
- Supporting Cluster:
  - generate prompt from frame
  - AI prompt analyzer for video
- Conversion Path:
  - `/shot-to-prompt` -> `/prompts`
  - `/shot-to-prompt` -> pricing CTA

### 4) Camera Moves (`/camera-moves`)
- Primary Intent: educational/tutorial intent.
- Secondary Intent: camera language for prompt writing.
- SEO Role: top-of-funnel learning content that feeds product pages.
- Primary Cluster:
  - camera movements guide
  - dolly pan tilt tracking explained
  - cinematic camera moves
- Supporting Cluster:
  - handheld vs steadicam
  - whip pan, dutch angle, dolly zoom
  - AI-native camera moves
- Conversion Path:
  - `/camera-moves` -> `/prompts`
  - `/camera-moves` -> `/shot-to-prompt`

### 5) Modern Moves (`/modern-moves`)
- Primary Intent: modern/AI-native camera motion patterns for prompt writing.
- Secondary Intent: inspiration/education (not a transactional page).
- SEO Role: optional. If it remains a development/demo page, set `noindex` and keep out of sitemap.
- Primary Cluster:
  - AI-native camera moves
  - modern camera moves for AI video
  - orbit, drone, dolly zoom, push through
- Conversion Path:
  - `/modern-moves` -> `/camera-moves`
  - `/modern-moves` -> `/prompts`

---

## Cannibalization Guardrails

### Home vs Prompt Vault
- Home should target broad category + brand.
- `/prompts` should target "library" and "best prompts" transactional terms.
- Do not publish long form "best prompts" sections on home that compete with `/prompts`.

### Prompt Vault vs Shot-to-Prompt
- `/prompts` targets browsing curated prompts.
- `/shot-to-prompt` targets generation from reference media.
- Keep headings and metadata distinct:
  - `/prompts`: "library", "collection", "curated"
  - `/shot-to-prompt`: "tool", "convert", "generate from image/frame"

### Camera Moves vs Shot-to-Prompt
- `/camera-moves` is education-first.
- `/shot-to-prompt` is utility-first.
- Avoid "full camera movement glossary" inside `/shot-to-prompt`; link to `/camera-moves`.

---

## Metadata Direction (By Route)

- `/`
  - Title theme: "AI video prompts" + brand.
  - Description theme: outcome, speed, reliability.

- `/prompts`
  - Title theme: "Prompt Vault" + "Runway/Pika prompt library".
  - Description theme: breadth of prompt set + filtering.

- `/shot-to-prompt`
  - Title theme: "Shot to Prompt" + "image/frame to prompt".
  - Description theme: upload, analyze, generate.

- `/camera-moves`
  - Title theme: "Camera movements guide".
  - Description theme: interactive card-based learning + prompt writing benefit.

- `/#pricing` (section, not route)
  - Conversion goal: reduce friction and increase trust.
  - Avoid treating this as a standalone SEO page unless you add `/pricing`.

---

## Internal Link Rules

- Home: link to all three core routes in body copy and cards.
- Prompt Vault:
  - Link to Shot-to-Prompt as custom workflow extension.
  - Link to Camera Moves for composition/motion education.
- Shot-to-Prompt:
  - Link back to Prompt Vault for refinement templates.
  - Link to Camera Moves when movement terms appear.
- Camera Moves:
  - Link to Prompt Vault with "apply these moves in prompts".
  - Link to Shot-to-Prompt for turning references into prompts.

---

## Content Expansion Targets (Next Step)

### High-Value Child Pages to Add Under `/prompts`
- `/prompts/product-ads`
- `/prompts/short-form-social`
- `/prompts/cinematic-storytelling`
- `/prompts/world-building`

### High-Value Child Pages to Add Under `/camera-moves`
- `/camera-moves/classic`
- `/camera-moves/dynamic`
- `/camera-moves/ai-native`

### Thin Page Guardrail
- Only ship new indexable routes if they include:
  - unique copy (not templated duplicates)
  - at least 1 concrete example (prompt or workflow)
  - clear internal links to the core conversion path

---

## Measurement Setup for This Map

- Track each route as its own keyword group in Search Console notes.
- Weekly checks:
  - impressions
  - CTR
  - avg position
  - top query drift (is page ranking for intended cluster)
- If route ranks for wrong cluster:
  - tighten H1/title/meta to intended intent
  - adjust internal links to reinforce target theme
