# GSC Post-Deploy Checklist (Cineworkflo)

Use this checklist after each SEO deploy.

## 1) Confirm deployment artifacts
- Verify Netlify build command is `npm run build:seo`.
- Confirm `dist/prompts/index.html`, `dist/shot-to-prompt/index.html`, and `dist/camera-moves/index.html` are generated.
- Confirm `public/sitemap.xml` is current date and includes only live URLs.

## 2) URL Inspection (Google Search Console)
Inspect these URLs one by one:
- `https://cineworkflo.com/`
- `https://cineworkflo.com/prompts`
- `https://cineworkflo.com/shot-to-prompt`
- `https://cineworkflo.com/camera-moves`
- `https://cineworkflo.com/pricing`

For each URL, validate:
- Google-selected canonical matches page canonical.
- Page is indexable (except `/success`).
- Rendered HTML includes useful route-specific content.
- Metadata in rendered page includes route title and description.

## 3) Rich results and schema checks
- Run Rich Results Test on `/`, `/prompts`, `/shot-to-prompt`, `/camera-moves`, `/pricing`.
- Confirm expected schema appears:
  - `/`: `WebSite`, `SoftwareApplication`, `Organization`
  - Child routes: `WebPage`, `BreadcrumbList`
  - FAQ routes: `FAQPage` where visible FAQ exists

## 4) Crawl and robots checks
- Verify `https://cineworkflo.com/robots.txt` is reachable and references sitemap.
- Verify `https://cineworkflo.com/sitemap.xml` is reachable and valid XML.
- Verify `/success` responses include `X-Robots-Tag: noindex, nofollow, noarchive`.

## 5) Internal link checks
- Home page contains visible links to `/prompts`, `/shot-to-prompt`, `/camera-moves`.
- Each core route has breadcrumb navigation back to Home.
- `/prompts`, `/shot-to-prompt`, and `/camera-moves` cross-link to each other via CTA blocks.

## 6) Post-release monitoring (7 days)
- In GSC Performance, compare last 7 days vs previous 7 days for:
  - clicks
  - impressions
  - average CTR
  - average position
- In GSC Indexing, check for:
  - new crawl anomalies
  - canonical conflicts
  - soft 404 spikes

## 7) Action log template
Keep one short log entry per deploy:
- Date:
- Commit:
- URLs inspected:
- Issues found:
- Fix owner:
- Fix ETA:
