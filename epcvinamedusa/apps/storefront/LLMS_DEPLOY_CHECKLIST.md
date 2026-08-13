# llms.txt / GEO Deploy Checklist

Date: 2026-08-10

## Before deploy

- Confirm `public/llms.txt` exists and is included in the build output.
- Confirm `public/robots.txt` still contains the sitemap line.
- Confirm `Content-Signal:` is present only if the policy is intentional.
- Confirm route metadata changes do not exceed title length targets.

## After deploy

- Visit `https://epcvina.com/llms.txt` and confirm it is publicly reachable.
- Visit `https://epcvina.com/robots.txt` and confirm it still returns the expected crawl directives.
- Verify the homepage still resolves canonical to `https://epcvina.com/`.
- Verify representative dynamic pages:
  - `/solar-home/he-thong/<slug>`
  - `/hybrid-bess/<slug>`
  - `/ung-dung/<slug>`
  - `/thiet-bi/<category>`

## Smoke checks

- Title tags are human-readable and not raw slugs.
- Descriptions are unique enough across pages.
- Noindex is only present on private/internal pages.
- Sitemap URL remains `https://epcvina.com/sitemap-index.xml`.
- `llms.txt` points to the most important intent pages.

## Suggested verification order

1. Open `llms.txt`
2. Open `robots.txt`
3. Inspect homepage source
4. Inspect one product page
5. Inspect one combo page
6. Inspect one local landing page
7. Inspect one blog article

## Notes

- If the site is deployed behind a CDN, allow a short cache window before rechecking.
- If `llms.txt` or `robots.txt` is cached aggressively, purge or version the file only if necessary.
