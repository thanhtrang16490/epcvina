# Lighthouse Performance Audit Report
## epcvina.com (Production)

**Date:** June 13, 2026  
**Audited URL:** https://epcvina.com/  
**Lighthouse Version:** 12.8.2  
**Network Conditions:** Desktop & Mobile (Throttled)  

---

## EXECUTIVE SUMMARY

The epcvina.com website has moderate performance issues across both desktop and mobile experiences. While Core Web Vitals such as CLS and TBT are excellent, critical metrics like LCP (Largest Contentful Paint) and Speed Index are significantly below recommended thresholds.

| Metric | Desktop | Mobile | Status |
|--------|---------|--------|--------|
| **Overall Performance Score** | 68/100 | 66/100 | NEEDS IMPROVEMENT |
| **Status** | Moderate | Poor | |
| **FCP** | 1.8 s | 4.5 s | Below Target |
| **LCP** | 3.1 s | 4.6 s | Well Below Target |
| **CLS** | 0.002 | 0.000 | Excellent |
| **TBT** | 0 ms | 20 ms | Excellent |

---

## CORE WEB VITALS - DETAILED ANALYSIS

### First Contentful Paint (FCP)
- **Desktop:** 1.8s (Score: 0.38/1.0) - At threshold but acceptable
- **Mobile:** 4.5s (Score: 0.15/1.0) - **POOR**
- **Target:** < 1.8s for good performance
- **Impact:** Users don't see visual content immediately; mobile experience is severely impacted
- **Issues:**
  - Render-blocking CSS is delaying FCP by 240ms on desktop, 1350ms on mobile
  - Image loading is slow, particularly the hero section

### Largest Contentful Paint (LCP)
- **Desktop:** 3.1s (Score: 0.3/1.0) - **CRITICAL**
- **Mobile:** 4.6s (Score: 0.35/1.0) - **CRITICAL**
- **Target:** < 2.5s for good performance (< 4.0s at minimum)
- **Core Issue:** The LCP element is likely a large image (hero-bg.png at 1.7 MB)
- **Impact:** Users perceive the page as slow to load main content
- **Estimated Impact:** Each additional 1 second of LCP = ~7% conversion drop

### Cumulative Layout Shift (CLS)
- **Desktop:** 0.002 (Score: 1.0/1.0) - **EXCELLENT**
- **Mobile:** 0.000 (Score: 1.0/1.0) - **EXCELLENT**
- **Target:** < 0.1 (passing)
- **Status:** No layout instability detected. No DOM shifts during load.

### Total Blocking Time (TBT)
- **Desktop:** 0 ms (Score: 1.0/1.0) - **EXCELLENT**
- **Mobile:** 20 ms (Score: 1.0/1.0) - **EXCELLENT**
- **Target:** < 200ms
- **Status:** Main thread is responsive; no JavaScript blocking

### Time to Interactive (TTI)
- **Desktop:** 3.1s (Score: 0.77/1.0) - Acceptable
- **Mobile:** 7.1s (Score: 0.51/1.0) - **POOR**
- **Target:** < 3.8s recommended
- **Issue:** Mobile pages take too long to become interactive

---

## TOP PERFORMANCE OPPORTUNITIES

### 1. ELIMINATE RENDER-BLOCKING CSS (Critical Priority)
**Potential Savings:**
- Desktop: 240ms
- Mobile: 1,350ms (5.6x impact)

**Issue:**
- File: `_astro/DashboardLayout.DI1S_afj.css`
- This CSS blocks page rendering until it loads

**Recommended Actions:**
1. **Defer non-critical CSS:** Split CSS into critical (above-fold) and deferred
2. **Use Critical CSS extraction:** Extract only CSS needed for above-fold content
3. **Inline critical CSS:** Consider inlining critical styles in `<head>`
4. **Load remaining CSS asynchronously:** Use `media="print"` trick or `<link rel="preload">`

**Expected Impact:** 20-30% improvement in FCP and LCP on mobile

---

### 2. OPTIMIZE IMAGES - SERVE MODERN FORMATS (High Priority)
**Potential Savings:**
- Total wasted bytes: **1.86 MB**
- Mobile likely impacted more due to network constraints

**Problematic Images:**
| Image | Current Size | Format | Issue |
|-------|---------|--------|-------|
| hero-bg.png | 1.72 MB | PNG | Should be WebP/AVIF |
| hero-background Large.jpeg | 156 KB | JPEG | Should be WebP/AVIF |
| sample-combo.jpg | 63 KB | JPEG | Should be WebP/AVIF |
| logo-epcvina-solar.png | 12 KB | PNG | Needs lazy-loading |

**Recommended Actions:**
1. **Convert images to WebP/AVIF:**
   - hero-bg.png: 1.72 MB → ~400-600 KB (70% reduction expected)
   - Other images: 15-30% size reduction
2. **Use `<picture>` element with fallbacks:**
   ```html
   <picture>
     <source srcset="image.avif" type="image/avif">
     <source srcset="image.webp" type="image/webp">
     <img src="image.jpg" alt="...">
   </picture>
   ```
3. **Implement responsive images:** Use srcset for different screen sizes
4. **Add height/width attributes:** Prevent layout shift

**Expected Impact:** 25-40% reduction in page load time, especially on mobile networks

---

### 3. REDUCE UNUSED JAVASCRIPT (High Priority)
**Total Unused Code:**
- supabase.js: 173 KB unused
- react-vendor.js: 72 KB unused
- framer-motion.js: 69 KB unused
- Total: ~314 KB of unused JavaScript

**Issues:**
- These libraries are loaded even when not needed on the page
- Increases parse/compile time on mobile devices

**Recommended Actions:**
1. **Code splitting:** Load Supabase only on pages that need auth/data
2. **Dynamic imports:** Use `await import()` for libraries needed later
3. **Tree-shaking:** Ensure unused exports are removed during build
4. **Lazy-load animations:** Load Framer Motion only on pages with animations
5. **Review bundle:**
   ```bash
   npm install -D @astro/webvitals
   npx astro build --view-trace
   ```

**Expected Impact:** 15-25% JS bundle reduction, 10-15% improvement in TTI

---

### 4. DEFER OFFSCREEN IMAGES (Medium Priority - Mobile Only)
**Affected Images:**
- logo-epcvina-solar-white.png (46 KB)
- logo-epcvina-solar.png (39 KB)

**Issue:**
- Logos in sidebar/footer load immediately even if below fold

**Recommended Actions:**
1. **Add `loading="lazy"` attribute:**
   ```html
   <img src="logo.png" loading="lazy" alt="..." width="200" height="100">
   ```
2. **Lazy-load with Intersection Observer API** for better control
3. **Preload LCP image explicitly:**
   ```html
   <link rel="preload" as="image" href="hero-bg.webp" imagesrcset="...">
   ```

**Expected Impact:** 5-10% improvement in mobile FCP

---

### 5. OPTIMIZE DOM SIZE (Medium Priority)
**Current Size:** 2,128 elements
**Status:** Score 0.5/1.0 - Exceeds recommended limits
**Target:** < 1,500 elements recommended

**Recommendations:**
1. **Audit component usage:** Remove unused sidebar/menu items
2. **Virtual scrolling:** For long lists, render only visible items
3. **Code splitting:** Load sections on-demand (e.g., FAQ, testimonials)
4. **Remove duplicate elements:** Check for duplicate navigation, heroes

**Expected Impact:** 5-10% improvement in overall performance

---

## NETWORK & RESOURCE SUMMARY

**Total Page Statistics:**
- **First Contentful Paint:** 1.8s (desktop) / 4.5s (mobile)
- **Full Page Load:** ~5-6 seconds (desktop) / ~8-10 seconds (mobile)

### Critical Path Resources:
1. DashboardLayout.css (render-blocking)
2. hero-bg.png / hero-background Large.jpeg
3. React vendor bundle
4. Supabase client library

---

## PRIORITY ACTION PLAN

### Phase 1: Quick Wins (1-2 weeks)
1. **Lazy-load offscreen images** - 30 min implementation
2. **Add critical CSS extraction** - 2-3 hours
3. **Convert hero images to WebP** - 1-2 hours
4. **Add image loading="lazy"** - 30 min

**Expected Improvement:** +8-12 points in performance score

### Phase 2: Medium-term (2-4 weeks)
1. **Full image optimization** - WebP/AVIF conversion pipeline
2. **Code splitting for Supabase** - 4-6 hours
3. **Lazy-load Framer Motion** - 2-3 hours
4. **Implement critical CSS tool** - 3-4 hours

**Expected Improvement:** +15-20 points in performance score

### Phase 3: Long-term (1-2 months)
1. **DOM size optimization** - Component audit and refactoring
2. **Dynamic imports for heavy libraries** - 8-10 hours
3. **Image CDN with automatic optimization** - (e.g., Cloudinary, Imgix)
4. **Advanced caching strategies** - Cache headers optimization

**Expected Final Score:** 85-95/100

---

## BROWSER COMPATIBILITY & REQUIREMENTS

- **WebP support:** 96% of modern browsers (use fallbacks for IE)
- **AVIF support:** 70% of modern browsers (newer Chrome, Firefox, Safari)
- **Modern CSS features:** All recommended optimizations use standard CSS

---

## MONITORING RECOMMENDATIONS

1. **Set up Web Vitals monitoring:**
   - Use `web-vitals` npm package
   - Send data to analytics (GA4, Sentry, etc.)

2. **Performance budgets:**
   - LCP: < 2.5s (critical)
   - FCP: < 1.8s
   - Speed Index: < 3.5s
   - JS bundle: < 200 KB (gzipped)

3. **Automated CI checks:**
   ```bash
   npm run lighthouse:ci
   ```

4. **Monthly audits** against competitors (SLMSolar.com, etc.)

---

## NOTES

- **SEO Impact:** LCP issues affect Core Web Vitals ranking in Google Search
- **Mobile Traffic:** Over 60% of users likely on mobile, significantly impacted
- **Conversion:** Every 1s improvement in LCP = ~7% increase in conversions
- **Server Response:** TTFB (Time to First Byte) is good (~200ms), issue is client-side

---

## AUDIT FILES

Raw Lighthouse data available at:
- Desktop: `/Users/thanhtrang/Documents/epcvina.com/lighthouse-desktop.json`
- Mobile: `/Users/thanhtrang/Documents/epcvina.com/lighthouse-mobile.json`

Generate HTML reports:
```bash
npm install -g lighthouse
lighthouse https://epcvina.com --output=html --output-path=./report-desktop.html --preset=desktop
lighthouse https://epcvina.com --output=html --output-path=./report-mobile.html --preset=perf
```

---

**Report Generated:** 2026-06-13  
**Audited By:** Lighthouse CLI v12.8.2
