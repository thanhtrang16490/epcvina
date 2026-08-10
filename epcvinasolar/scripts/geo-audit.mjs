#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const repoRoot = path.resolve(cwd);
const pagesDir = path.join(repoRoot, 'src', 'pages');
const publicDir = path.join(repoRoot, 'public');
const args = new Set(process.argv.slice(2));
const failOnHigh = args.has('--fail-on-high');
const jsonOnly = args.has('--json');
const mdOnly = args.has('--md');

const read = (file) => fs.readFileSync(file, 'utf8');
const exists = (file) => fs.existsSync(file);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(file));
    else if (entry.isFile() && file.endsWith('.astro')) out.push(file);
  }
  return out;
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function extractFirst(regex, text) {
  const match = text.match(regex);
  return match ? clean(match[1]) : '';
}

function extractMetaDescription(text) {
  const match = text.match(/<meta\b[\s\S]*?name=["']description["'][\s\S]*?content=["']([\s\S]*?)["'][\s\S]*?>/i);
  return match ? clean(match[1]) : '';
}

function resolveStringConstant(name, text) {
  const patterns = [
    new RegExp(`const\\s+${name}\\s*=\\s*['"]([^'"]+)['"]`),
    new RegExp(`const\\s+${name}\\s*=\\s*\\\`([^\\\`]+)\\\``),
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return clean(match[1]);
  }
  return '';
}

function resolvePropValue(propName, text) {
  if (propName === 'title') {
    const htmlTitle = extractFirst(/<title>([^<]+)<\/title>/i, text);
    if (htmlTitle) return { value: htmlTitle, present: true };
  }
  if (propName === 'description') {
    const htmlDescription = extractMetaDescription(text);
    if (htmlDescription) return { value: htmlDescription, present: true };
  }

  const literal = extractFirst(new RegExp(`${propName}\\s*=\\s*['"]([^'"]+)['"]`), text);
  if (literal) return { value: literal, present: true };

  const template = extractFirst(new RegExp(`${propName}\\s*=\\s*\\\`([^\\\`]+)\\\``), text);
  if (template) return { value: template, present: true };

  const varMatch = text.match(new RegExp(`${propName}\\s*=\\s*\\{\\s*([A-Za-z0-9_]+)\\s*\\}`));
  if (varMatch) {
    const resolved = resolveStringConstant(varMatch[1], text);
    if (resolved) return { value: resolved, present: true };
    return { value: `__dynamic__:${propName}`, present: true };
  }

  const dashboardLayoutMatch = text.match(new RegExp(`<DashboardLayout[\\s\\S]*?${propName}\\s*=`, 'm'));
  if (dashboardLayoutMatch) {
    return { value: `__dynamic__:${propName}`, present: true };
  }

  return { value: '', present: false };
}

function scoreLength(length, targetMin, targetMax) {
  if (length >= targetMin && length <= targetMax) return 100;
  if (length < targetMin) return Math.max(20, Math.round((length / targetMin) * 100));
  const overflow = length - targetMax;
  return Math.max(40, 100 - overflow * 2);
}

function titleScore(title) {
  return scoreLength(title.length, 28, 60);
}

function descriptionScore(desc) {
  return scoreLength(desc.length, 110, 160);
}

const routes = walk(pagesDir);
const pages = routes.map((file) => {
  const text = read(file);
  const isRedirect = /return\s+Astro\.redirect\(/.test(text);
  const title = resolvePropValue('title', text);
  const desc = resolvePropValue('description', text);
  const noindex = /noindex\s*=\s*\{?true\}?/.test(text);
  const dynamic = /\[\.\.\.|Astro\.params|getStaticPaths\(/.test(text);
  return {
    file: path.relative(repoRoot, file),
    title: clean(title.value),
    description: clean(desc.value),
    titlePresent: title.present,
    descriptionPresent: desc.present,
    noindex,
    dynamic,
    isRedirect,
  };
});

const titleGroups = new Map();
for (const page of pages) {
  if (!page.title) continue;
  titleGroups.set(page.title, (titleGroups.get(page.title) || 0) + 1);
}

const issues = [];
for (const page of pages) {
  if (page.isRedirect) continue;
  if (!page.titlePresent) issues.push({ severity: 'high', page: page.file, issue: 'Missing title' });
  if (!page.descriptionPresent) issues.push({ severity: 'high', page: page.file, issue: 'Missing description' });
  if (page.titlePresent && !String(page.title).startsWith('__dynamic__:') && page.title.length > 60) issues.push({ severity: 'medium', page: page.file, issue: `Title too long (${page.title.length})` });
  if (page.descriptionPresent && !String(page.description).startsWith('__dynamic__:') && page.description.length > 160) issues.push({ severity: 'medium', page: page.file, issue: `Description too long (${page.description.length})` });
  if (!page.noindex && page.titlePresent && !String(page.title).startsWith('__dynamic__:') && (titleGroups.get(page.title) || 0) > 1) issues.push({ severity: 'medium', page: page.file, issue: 'Duplicate title' });
}

const llmsPath = path.join(publicDir, 'llms.txt');
const robotsPath = path.join(publicDir, 'robots.txt');
const llmsExists = exists(llmsPath);
const robotsExists = exists(robotsPath);
const robotsText = robotsExists ? read(robotsPath) : '';

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    pages: pages.length,
    dynamicPages: pages.filter((p) => p.dynamic).length,
    redirectPages: pages.filter((p) => p.isRedirect).length,
    noindexPages: pages.filter((p) => p.noindex).length,
    issues: issues.length,
    llmsTxt: llmsExists,
    robotsTxt: robotsExists,
    contentSignals: /Content-Signal:/i.test(robotsText),
    sitemapReferenced: /Sitemap:\s*https:\/\/epcvina\.com\/sitemap-index\.xml/i.test(robotsText),
  },
  scores: {
    titleQuality: Math.round(pages.reduce((sum, p) => sum + (p.titlePresent && !String(p.title).startsWith('__dynamic__:') ? titleScore(p.title) : 85), 0) / Math.max(1, pages.length)),
    descriptionQuality: Math.round(pages.reduce((sum, p) => sum + (p.descriptionPresent && !String(p.description).startsWith('__dynamic__:') ? descriptionScore(p.description) : 90), 0) / Math.max(1, pages.length)),
    technicalFoundation: [
      llmsExists ? 100 : 0,
      robotsExists ? 100 : 0,
      /Content-Signal:/i.test(robotsText) ? 100 : 0,
      /Sitemap:\s*https:\/\/epcvina\.com\/sitemap-index\.xml/i.test(robotsText) ? 100 : 0,
    ].reduce((a, b) => a + b, 0) / 4,
  },
  issues,
  pages: pages.sort((a, b) => a.file.localeCompare(b.file)),
};

const outputJson = path.join(repoRoot, 'geo-audit-report.json');
const outputMd = path.join(repoRoot, 'geo-audit-report.md');

fs.writeFileSync(outputJson, JSON.stringify(report, null, 2));

const md = [
  '# EPCVINA GEO Audit Report',
  '',
  `Generated: ${report.generatedAt}`,
  '',
  '## Summary',
  `- Pages scanned: ${report.summary.pages}`,
  `- Dynamic pages: ${report.summary.dynamicPages}`,
  `- Noindex pages: ${report.summary.noindexPages}`,
  `- Issues found: ${report.summary.issues}`,
  `- llms.txt: ${report.summary.llmsTxt ? 'present' : 'missing'}`,
  `- robots.txt: ${report.summary.robotsTxt ? 'present' : 'missing'}`,
  `- Content-Signal: ${report.summary.contentSignals ? 'present' : 'missing'}`,
  `- Sitemap referenced: ${report.summary.sitemapReferenced ? 'yes' : 'no'}`,
  '',
  '## Scores',
  `- Title quality: ${report.scores.titleQuality}/100`,
  `- Description quality: ${report.scores.descriptionQuality}/100`,
  `- Technical foundation: ${Math.round(report.scores.technicalFoundation)}/100`,
  '',
  '## Issues',
  ...(issues.length ? issues.map((issue) => `- [${issue.severity.toUpperCase()}] ${issue.page}: ${issue.issue}`) : ['- None found']),
  '',
  '## Notes',
  '- This audit is source-based, not crawl-based.',
  '- For production verification, open the deployed `llms.txt` and `robots.txt` URLs.',
  '',
].join('\n');

fs.writeFileSync(outputMd, md);

console.log(md);

if (failOnHigh && issues.some((issue) => issue.severity === 'high')) {
  process.exitCode = 1;
}

if (jsonOnly && !mdOnly) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
}
