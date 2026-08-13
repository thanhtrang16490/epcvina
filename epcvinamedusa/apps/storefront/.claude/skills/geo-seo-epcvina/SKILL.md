---
name: geo-seo-epcvina
description: "Internal GEO/SEO audit skill for EPCVINA Solar. Use for local SEO audits, llms.txt checks, robots.txt policy review, metadata consistency, route inspection, and generating repeatable audit reports."
---
# EPCVINA GEO SEO Skill

Use this skill when auditing or improving EPCVINA Solar for:
- local SEO
- AI search readiness
- llms.txt
- robots.txt policy
- canonical URLs
- title and description consistency
- structured data
- dynamic route metadata
- repeatable GEO audit reports

## What this skill does

- Runs a source-based GEO audit over Astro pages.
- Checks for missing or weak metadata.
- Flags long or duplicate titles/descriptions.
- Verifies `llms.txt` and `robots.txt`.
- Produces `geo-audit-report.md` and `geo-audit-report.json`.

## How to run

From the repo root:

```bash
node ./scripts/geo-audit.mjs
```

## What to review first

1. `geo-audit-report.md`
2. `geo-audit-report.json`
3. `public/llms.txt`
4. `public/robots.txt`

## Audit priorities

### Critical

- Missing title
- Missing description
- Accidental `noindex` on public pages
- Missing sitemap reference

### High

- Raw slug titles on dynamic pages
- Missing `llms.txt`
- Missing structured local-business signals

### Medium

- Titles longer than 60 characters
- Descriptions longer than 160 characters
- Duplicate titles

## EPCVINA GEO principles

- Prefer one canonical page per intent.
- Use real projects as proof.
- Keep local landing pages specific.
- Use FAQs for retrieval-friendly answers.
- Make dynamic route metadata human-readable.

## Deliverables

- `geo-audit-report.md`
- `geo-audit-report.json`
- actionable follow-up edits when needed
