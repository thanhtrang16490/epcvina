# ✅ SEO Quick Start Checklist - First 14 Days
## EPCVINA Solar - Immediate Action Items

**Start Date:** June 23, 2026  
**Target Completion:** July 7, 2026

---

## 🚀 WEEK 1: CRITICAL FIXES (Days 1-7)

### Day 1-2: Performance Optimization (4-5 hours)

#### Task 1: Convert Hero Images to WebP ⚡
**Priority:** P0 - CRITICAL  
**Time:** 2 hours

- [ ] Install Sharp: `npm install sharp`
- [ ] Convert hero-bg.png (1.72MB) → hero-bg.webp (~400KB)
- [ ] Generate responsive variants:
  - [ ] hero-bg-768.webp (mobile)
  - [ ] hero-bg-1280.webp (tablet)
  - [ ] hero-bg-1920.webp (desktop)
- [ ] Update homepage to use `<picture>` element with srcset
- [ ] Test LCP improvement with Lighthouse

**Expected Impact:** LCP 4.6s → 2.5s (-45%)

---

#### Task 2: Add Lazy Loading to Images 🖼️
**Priority:** P0 - CRITICAL  
**Time:** 30 minutes

- [ ] Add `loading="lazy"` to all images below the fold
- [ ] Exclude LCP element (hero image) from lazy loading
- [ ] Add `fetchpriority="high"` to hero image
- [ ] Verify with Lighthouse "Defer offscreen images" audit

**Files to check:**
- [ ] `src/pages/index.astro`
- [ ] `src/components/home/layout/SolarFullPage.astro`
- [ ] All product/combo pages

---

#### Task 3: Preload Critical Resources ⚡
**Priority:** P0  
**Time:** 30 minutes

- [ ] Add to DashboardLayout.astro `<head>`:
  ```html
  <link rel="preload" as="image" href="/hero-bg-1920.webp" />
  ```
- [ ] Preload critical fonts (if any)
- [ ] Test with Lighthouse "Preload key requests"

---

### Day 3-4: CSS & JS Optimization (6-8 hours)

#### Task 4: Defer Non-Critical CSS 🎨
**Priority:** P0 - CRITICAL  
**Time:** 3-4 hours

- [ ] Extract critical CSS (above-fold only)
- [ ] Inline critical CSS in `<head>`
- [ ] Defer remaining CSS with preload trick:
  ```html
  <link rel="preload" href="/non-critical.css" as="style" 
        onload="this.onload=null;this.rel='stylesheet'" />
  ```
- [ ] Test FCP improvement (target: 4.5s → 3.15s)

**Tools:**
- Use Chrome DevTools Coverage tab
- Or: `npm install -D critical`

---

#### Task 5: Code Split JavaScript ⚡
**Priority:** P0 - HIGH  
**Time:** 4-6 hours

- [ ] Make Supabase dynamic import (only on pages that need it):
  ```javascript
  // Find all Supabase imports
  // Change from:
  import { supabase } from '@/lib/supabase';
  
  // To:
  const { supabase } = await import('@/lib/supabase');
  ```
- [ ] Lazy-load Framer Motion:
  ```javascript
  const framer = await import('framer-motion');
  ```
- [ ] Review all `client:load` directives - change to `client:visible` where possible
- [ ] Verify bundle size reduction (target: -314KB)

**Files to audit:**
- [ ] All pages using Supabase
- [ ] All pages with animations
- [ ] `astro.config.mjs` (verify manualChunks)

---

### Day 5-7: Tracking & Monitoring Setup (2-3 hours)

#### Task 6: Setup Google Search Console 📊
**Priority:** P0 - CRITICAL  
**Time:** 1 hour

- [ ] Go to: https://search.google.com/search-console
- [ ] Add property: `https://epcvina.com`
- [ ] Verify ownership:
  - Option A: Upload HTML file to `/public`
  - Option B: Add DNS TXT record
- [ ] Submit sitemap:
  - URL: `https://epcvina.com/sitemap-index.xml`
  - Click "Add new sitemap" in GSC
- [ ] Check coverage report for errors
- [ ] Request indexing for key pages:
  - [ ] Homepage
  - [ ] /on-grid
  - [ ] /hybrid-bess
  - [ ] /contact

**Deliverable:** ✓ GSC verified & sitemap submitted

---

#### Task 7: Setup Google Analytics 4 📈
**Priority:** P0 - CRITICAL  
**Time:** 1 hour

- [ ] Go to: https://analytics.google.com
- [ ] Create new property: "EPCVINA Solar"
- [ ] Get Measurement ID (format: G-XXXXXXXXXX)
- [ ] Add to DashboardLayout.astro `<head>`:
  ```html
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
  ```
- [ ] Setup conversion tracking:
  - [ ] Contact form submissions
  - [ ] Phone number clicks (0988 446 113)
  - [ ] Zalo button clicks
- [ ] Test tracking with GA4 DebugView

**Deliverable:** ✓ GA4 live & tracking conversions

---

## 📝 WEEK 2: CONTENT FOUNDATION (Days 8-14)

### Day 8-10: Blog Content Creation (8-10 hours)

#### Task 8: Write 2 Blog Posts ✍️
**Priority:** P0  
**Time:** 4-5 hours each

**Blog Post 1: "Chi Phí Lắp On-Grid 5kWp Hà Nội 2026"**
- [ ] Research current pricing (contact sales team)
- [ ] Write 2,000+ words
- [ ] Include:
  - H1 with keyword: "Chi Phí Lắp Điện Mặt Trời 5kWp"
  - Cost breakdown table
  - ROI calculation
  - 3-5 internal links
  - 2-3 images with alt text
  - FAQ section (3-5 questions)
- [ ] Add to: `src/content/blog/chi-phi-on-grid-5kwp.md`
- [ ] Optimize meta title & description

**Blog Post 2: "5 Lý Do Chọn EPCVINA Solar"**
- [ ] Highlight unique selling points
- [ ] Write 1,500+ words
- [ ] Include customer testimonials
- [ ] Add case study references
- [ ] Add to: `src/content/blog/ly-do-chon-epcvina.md`

**Content Checklist:**
- [ ] Primary keyword in H1
- [ ] Primary keyword in first 100 words
- [ ] 3-5 H2s with secondary keywords
- [ ] 3-5 internal links
- [ ] 2-3 external links (high authority)
- [ ] Meta description 150-160 chars
- [ ] Title 50-60 chars

---

#### Task 9: Optimize Existing Blog Posts 🔧
**Priority:** P1  
**Time:** 2 hours

- [ ] Review existing 3 blog posts:
  - [ ] chi-phi-lap-on-grid-ha-noi.md
  - [ ] on-grid-vs-hybrid.md
  - [ ] quy-trinh-lap-dat-solar.md
- [ ] Add internal links (3-5 per post)
- [ ] Optimize meta descriptions
- [ ] Add FAQ sections if missing
- [ ] Update images with alt text
- [ ] Verify all links work

---

### Day 11-12: Local SEO Setup (5-6 hours)

#### Task 10: Google Business Profile Optimization 📍
**Priority:** P0  
**Time:** 3-4 hours

- [ ] Go to: https://business.google.com
- [ ] Claim/verify listing for "EPCVINA Solar"
- [ ] Optimize all fields:
  - [ ] **Business Name:** EPCVINA Solar - Công ty Cổ phần Xây lắp EPC Việt Nam
  - [ ] **Category:** Solar Energy Equipment Supplier
  - [ ] **Secondary Category:** Electrical Installation Company
  - [ ] **Description (250 chars):** "Chuyên lắp đặt điện mặt trời on-grid & hybrid trọn gói tại Hà Nội. 500+ dự án. Bảo hành 25 năm. Tư vấn miễn phí. Hotline: 0988 446 113."
  - [ ] **Phone:** +84 988 446 113
  - [ ] **Website:** https://epcvina.com
  - [ ] **Address:** Phòng 315 - Khu TM Chung cư HVQP, Nguyễn Văn Huyên Kéo Dài, Tây Hồ, Hà Nội
  - [ ] **Hours:** Mon-Sat 08:00-17:30

- [ ] Add 20+ photos:
  - [ ] Office/showroom (3-5 photos)
  - [ ] Project installations (10-15 photos)
  - [ ] Team photos (3-5 photos)
  - [ ] Logo & cover photo

- [ ] Create first GBP post:
  - [ ] "What's New" post linking to new blog content
  - [ ] Add photo + CTA button

**Deliverable:** ✓ GBP fully optimized with photos

---

#### Task 11: Review Generation Campaign ⭐
**Priority:** P1  
**Time:** 1-2 hours

- [ ] Create customer list (20 past customers)
- [ ] Send review request emails:
  - [ ] Use email template (see SEO_ACTION_PLAN.md)
  - [ ] Include direct GBP review link
  - [ ] Send via email + Zalo
- [ ] Setup review monitoring:
  - [ ] Enable GBP review notifications
  - [ ] Create response template for positive reviews
  - [ ] Create response template for negative reviews

**Email Template:**
```
Subject: Chia sẻ trải nghiệm lắp điện mặt trời tại EPCVINA

Kính chào [Customer Name],

Cảm ơn anh/chị đã tin tưởng EPCVINA Solar! 

Nếu anh/chị hài lòng với dịch vụ, xin vui lòng dành 2 phút 
đánh giá trên Google giúp chúng tôi:
[GBP Review Link]

Mỗi đánh giá giúp chúng tôi phục vụ khách hàng tốt hơn.

Trân trọng,
EPCVINA Solar Team
Hotline: 0988 446 113
```

**Target:** 20 review requests sent

---

### Day 13-14: Quick SEO Wins (3-4 hours)

#### Task 12: Add Breadcrumb Schema 🍞
**Priority:** P1  
**Time:** 1-2 hours

- [ ] Create BreadcrumbList schema component
- [ ] Add to all pages with hierarchy:
  - [ ] /on-grid
  - [ ] /hybrid-bess
  - [ ] /solar-home
  - [ ] /equipment/*
  - [ ] /du-an/*
  - [ ] /blog/*

**Example Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://epcvina.com" },
    { "@type": "ListItem", "position": 2, "name": "Giải Pháp", "item": "https://epcvina.com/solutions" },
    { "@type": "ListItem", "position": 3, "name": "On-Grid", "item": "https://epcvina.com/on-grid" }
  ]
}
```

---

#### Task 13: Optimize Internal Linking 🔗
**Priority:** P1  
**Time:** 2 hours

- [ ] Add related posts section to blog template
- [ ] Link from homepage to pillar pages:
  - [ ] /on-grid
  - [ ] /hybrid-bess
  - [ ] /solar-home
- [ ] Add internal links in all blog posts (3-5 each)
- [ ] Create "Popular Articles" sidebar widget
- [ ] Verify navigation menu links are correct

---

## 📊 END OF WEEK 2: VERIFICATION

### Performance Audit Checklist

Run Lighthouse on https://epcvina.com:

- [ ] **Performance Score:** Target 75+ (from 66)
- [ ] **LCP:** Target <3.5s (from 4.6s)
- [ ] **FCP:** Target <3.5s (from 4.5s)
- [ ] **CLS:** Maintain <0.1 (currently 0.000 ✓)
- [ ] **TBT:** Maintain <200ms (currently 20ms ✓)

**If targets NOT met:**
- [ ] Re-check image optimization
- [ ] Verify CSS is deferred
- [ ] Check JS bundle size
- [ ] Review with Chrome DevTools Network tab

---

### SEO Health Checklist

- [ ] GSC: No critical errors
- [ ] GSC: Sitemap successfully processed
- [ ] GSC: Key pages indexed
- [ ] GA4: Tracking live (check Realtime report)
- [ ] GA4: Conversions configured
- [ ] GBP: Fully optimized with 20+ photos
- [ ] Blog: 5 posts published (3 old + 2 new)

---

### Content Checklist

- [ ] 5 blog posts live
- [ ] All posts have:
  - [ ] Optimized title (50-60 chars)
  - [ ] Optimized meta description (150-160 chars)
  - [ ] Internal links (3-5)
  - [ ] Images with alt text
  - [ ] FAQ section
- [ ] Homepage FAQ schema verified (use Rich Results Test)
- [ ] LocalBusiness schema verified

---

## 🎯 WEEK 2 DELIVERABLES

By July 7, 2026, you should have:

✅ Performance score 75+ (mobile)  
✅ LCP <3.5s (mobile)  
✅ GSC verified & sitemap submitted  
✅ GA4 tracking live with conversions  
✅ GBP fully optimized  
✅ 5 blog posts published  
✅ 20 review requests sent  
✅ Internal linking optimized  
✅ Breadcrumb schema added  

---

## 📈 TRACKING TEMPLATE

Use this to track daily progress:

| Date | Task | Status | Notes |
|------|------|--------|-------|
| Jun 23 | Image optimization | ⬜ Not Started | |
| Jun 23 | Lazy loading | ⬜ Not Started | |
| Jun 24 | Defer CSS | ⬜ Not Started | |
| Jun 24 | Code split JS | ⬜ Not Started | |
| Jun 25 | Setup GSC | ⬜ Not Started | |
| Jun 25 | Setup GA4 | ⬜ Not Started | |
| Jun 26 | Blog post 1 | ⬜ Not Started | |
| Jun 26 | Blog post 2 | ⬜ Not Started | |
| Jun 27 | GBP optimization | ⬜ Not Started | |
| Jun 27 | Review campaign | ⬜ Not Started | |
| Jun 28 | Breadcrumb schema | ⬜ Not Started | |
| Jun 28 | Internal linking | ⬜ Not Started | |

**Status Legend:**
- ⬜ Not Started
- 🔄 In Progress
- ✅ Complete
- ⚠️ Blocked

---

## 🔧 TOOLS & RESOURCES

### Required Tools (Free)
- [ ] Lighthouse (Chrome DevTools)
- [ ] Google Search Console
- [ ] Google Analytics 4
- [ ] Google Business Profile
- [ ] Rich Results Test: https://search.google.com/test/rich-results
- [ ] Mobile-Friendly Test: https://search.google.com/test/mobile-friendly

### Image Optimization
- [ ] Sharp: `npm install sharp`
- [ ] Or online: https://squoosh.app/
- [ ] Or CLI: `npm install -g imagemin-cli`

### Optional (Paid but Recommended)
- [ ] Semrush ($99/mo) - Keyword tracking
- [ ] Ahrefs ($99/mo) - Backlink analysis

---

## 🚨 TROUBLESHOOTING

### LCP Still High After Optimization?
1. Check hero image is actually WebP
2. Verify preload tag is in `<head>`
3. Check server response time (TTFB)
4. Use Chrome DevTools > Network > filter by Img

### CSS Not Deferring?
1. Verify preload link has correct path
2. Check `onload` handler is present
3. Use `<noscript>` fallback
4. Test with Lighthouse "Eliminate render-blocking resources"

### GSC Not Verifying?
1. Try HTML file upload method
2. Ensure file is in `/public` directory
3. Rebuild & redeploy after adding file
4. Try DNS verification as alternative

### GA4 Not Tracking?
1. Verify Measurement ID is correct (G-XXXXXXXXXX)
2. Check GA4 DebugView for real-time events
3. Use GA Debugger Chrome extension
4. Verify script is in `<head>` not `<body>`

---

## 📞 SUPPORT & QUESTIONS

**Need help?**
- SEO Action Plan: `/epcvinasolar/SEO_ACTION_PLAN.md`
- Marketing folder: `/marketing/seo_plan.md`
- Hotline: 0988 446 113
- Email: epcvina@hotmail.com

---

**Next Steps:** After completing this 14-day checklist, continue with the full 90-day plan in `SEO_ACTION_PLAN.md`.

**Version:** 1.0  
**Created:** June 23, 2026  
**Review:** July 7, 2026
