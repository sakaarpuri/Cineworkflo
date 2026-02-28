# CTR Optimization Playbook (Phase 3 Week 11)

Use this process every 2 weeks.

## 1) Pull candidate pages
- In GSC Performance, filter last 28 days.
- Sort by impressions.
- Select pages with:
  - high impressions
  - low CTR vs site median

## 2) Diagnose mismatch
- Compare top query intent vs current title/description.
- Identify if query intent is:
  - transactional
  - educational
  - navigational

## 3) Update metadata
- Adjust title first, then description.
- Keep one primary intent per page.
- Avoid changing multiple pages for same query cluster in one batch.

## 4) Track test log
Record:
- page URL
- old title/description
- new title/description
- date changed
- query cluster

## 5) Evaluate after 14 days
- Compare CTR delta
- Compare clicks delta
- Keep winner or iterate once more

## Current controlled test handles in product
- Prompt Vault CTA variant: `cwf_prompt_cta_variant` (`a` or `b`)
- Pricing CTA variant: `cwf_pricing_cta_variant` (`a` or `b`)
- Force variant by URL query: `?cta_variant=a` or `?cta_variant=b`
