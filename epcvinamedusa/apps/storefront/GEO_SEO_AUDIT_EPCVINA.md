# GEO / SEO Audit - EPCVINA Solar

Date: 2026-08-10

## Summary

EPCVINA Solar already has a strong technical SEO base:
- Canonical URLs are generated per page.
- Sitemap is enabled through `@astrojs/sitemap`.
- `robots.txt` is present and points to the sitemap.
- Structured data is used across homepage, services, projects, and product pages.

The biggest opportunity is to improve AI-search readiness and reduce metadata ambiguity on dynamic pages.

## Current strengths

- Strong local-business identity in schema.
- Many intent-specific landing pages for solar, hybrid, on-grid, BESS, and EV charging.
- Project pages provide proof of work and can support E-E-A-T.
- Product pages include schema and breadcrumbs.
- Internal app-like flows are mostly noindexed.

## Priority findings

### High

1. Dynamic hybrid combo pages need stable human-readable metadata.
- Status: implemented for `hybrid-bess/[slug]`.
- Why it matters: AI search and organic search both benefit from clear titles like `Hybrid 10.7 kWp 1 pha 10 kWh`.
- Remaining risk: other dynamic routes should be checked for similar slug-driven titles.

2. `llms.txt` was missing.
- Status: implemented in `public/llms.txt`.
- Why it matters: gives AI systems a concise retrieval map and preferred page set.

### Medium

3. `og:updated_time` should not be generated from build time.
- Status: implemented as optional `updatedTime` in the layout.
- Why it matters: avoids noisy metadata churn and makes update signals more meaningful.

4. The site would benefit from a dedicated AI-search policy section.
- Recommendation: consider adding `Content-Signal:` directives only after confirming your content-sharing policy.
- Note: this is still an emerging standard, so keep it optional and conservative.

5. Some landing pages appear close in intent and may overlap.
- Recommendation: keep one canonical page per primary intent.
- Examples to review:
  - city/province landing pages
  - quote pages
  - solar-home vs hybrid-bess variants

### Low

6. Several meta titles likely need normalization for consistency.
- Recommendation: standardize title patterns:
  - Service pages: `Dịch vụ / Giải pháp + keyword`
  - Product pages: `Product name + EPCVINA Solar`
  - Location pages: `Điện mặt trời [địa phương] | EPCVINA Solar`

## GEO readiness score

- AI retrievability: 7.5/10
- Technical SEO: 8.5/10
- Content clarity: 7.5/10
- Local intent coverage: 8.5/10
- Structured data: 8/10
- Overall: 8/10

## Recommended next actions

1. Audit all dynamic routes for title/description consistency.
2. Add `llms.txt` to root delivery and verify it is publicly reachable.
3. Decide whether to adopt `Content-Signal:` directives in `robots.txt`.
4. Create a page map of primary intents and canonical URLs.
5. Build a monthly GEO audit checklist.

## Suggested GEO checklist

- Verify homepage title, description, and canonical.
- Verify all service pages have unique titles.
- Verify all product pages have Product schema.
- Verify all projects have evidence-rich content.
- Verify FAQ pages answer specific user questions.
- Verify robots and sitemap are publicly accessible.
- Verify `llms.txt` is available and accurate.
- Verify no important pages are accidentally noindexed.

## Notes on AI search strategy

For this site, the strongest AI-search signals are likely:
- clear local intent
- real project proof
- direct pricing or quotation pages
- FAQ-rich service pages
- structured data with consistent entity names

That means the best GEO work is not just more content. It is better page routing, cleaner entity definitions, and stronger evidence pages.
