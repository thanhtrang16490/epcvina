# 🎯 SEO Action Plan - EPCVINA Solar
## Đánh Giá Toàn Diện & Kế Hoạch Hành Động 90 Ngày

**Ngày tạo:** 23 tháng 6, 2026  
**Website:** https://epcvina.com  
**Framework:** Astro v6.4.4 (SSR with Node adapter)  
**Thị trường:** Việt Nam - Năng lượng mặt trời

---

## 📊 PHẦN 1: ĐÁNH GIÁ HIỆN TRẠNG

### 1.1 Technical SEO Audit

#### ✅ Điểm Mạnh

**1. Infrastructure & Architecture**
- ✓ Astro framework - Static Site Generation với SSR capability
- ✓ Site cấu hình đúng: `https://epcvina.com` trong astro.config.mjs
- ✓ Sitemap tự động qua `@astrojs/sitemap` với i18n support
- ✓ robots.txt đã được cấu hình
- ✓ CompressHTML enabled trong build config

**2. Schema Markup (Structured Data)**
- ✓ LocalBusiness schema đầy đủ trong DashboardLayout
  - Company info, address, geo coordinates
  - Opening hours, service area (100km radius)
  - Service catalog (On-Grid, Hybrid)
  - Social profiles (Facebook, YouTube, LinkedIn, Zalo, TikTok)
- ✓ FAQPage schema trên homepage (6 questions)
- ✓ JSON-LD format chuẩn

**3. Meta Tags & SEO Elements**
- ✓ Title tags (50-60 chars) với keywords
- ✓ Meta descriptions (150-160 chars)
- ✓ Canonical URLs auto-generated
- ✓ Open Graph tags (Facebook, Zalo)
- ✓ Twitter Card metadata
- ✓ Vietnamese language (`lang="vi"`)

**4. Content Structure**
- ✓ 76 products/combos trong content collections
- ✓ 3 blog posts đã publish
- ✓ Multiple solution pages (on-grid, hybrid-bess, solar-home)
- ✓ Equipment catalog với categories
- ✓ Project pages với detailed information
- ✓ Tiếng Việt 100% - phù hợp target audience

#### ❌ Điểm Yếu Cần Khắc Phục

**1. Performance Issues (CRITICAL)**

| Metric | Desktop | Mobile | Target | Status |
|--------|---------|--------|--------|--------|
| Overall Score | 68/100 | 66/100 | 90+ | 🔴 POOR |
| LCP | 3.1s | 4.6s | <2.5s | 🔴 CRITICAL |
| FCP | 1.8s | 4.5s | <1.8s | 🔴 POOR |
| CLS | 0.002 | 0.000 | <0.1 | ✓ EXCELLENT |
| TBT | 0ms | 20ms | <200ms | ✓ EXCELLENT |

**Root Causes:**
- 🔴 Hero image (hero-bg.png) - **1.72 MB PNG** → cần WebP/AVIF
- 🔴 Render-blocking CSS: `_astro/DashboardLayout.css` delaying FCP 1.35s on mobile
- 🔴 Unused JavaScript: 314KB (Supabase 173KB, React 72KB, Framer 69KB)
- 🟡 DOM size: 2,128 elements (target <1,500)
- 🟡 Offscreen images không có lazy-loading

**2. Content Gaps**

| Content Type | Current | Target | Gap |
|--------------|---------|--------|-----|
| Blog posts | 3 | 25+ | 🔴 -22 |
| Pillar pages | 0 | 3-5 | 🔴 Missing |
| FAQ page | 1 (homepage) | Comprehensive | 🟡 Shallow |
| Case studies | 0 | 5-10 | 🔴 Missing |
| Tools/Calculators | 0 | 2-3 | 🔴 Missing |
| Video content | 0 | 5+ | 🔴 Missing |

**3. Local SEO Gaps**
- ❓ Google Business Profile - chưa xác nhận đã tối ưu
- ❓ Local citations - chưa có strategy
- ❓ Review management - chưa có process
- ❓ Local backlinks - chưa có outreach

**4. Link Profile**
- ❌ Backlink strategy - không có
- ❌ Internal linking - chưa tối ưu pillar-cluster
- ❌ External link building - chưa có outreach
- ❌ Domain authority - chưa track

**5. Technical Gaps**
- ❌ Core Web Vitals monitoring - chưa setup
- ❌ Image optimization pipeline - chưa có
- ❌ Code splitting strategy - Supabase/Framer load everywhere
- ❌ Performance budgets - chưa define

---

### 1.2 Keyword Research & Competitive Analysis

#### Primary Keywords (P0 - High Priority)

| Keyword | Volume (VN/mo) | Intent | Difficulty | Current Rank | Target |
|---------|----------------|--------|------------|--------------|--------|
| lắp đặt điện mặt trời | 3,600-8,900 | Transactional | 8/10 | TBD | Top 10 |
| điện mặt trời | 5,400-12,100 | Informational | 7/10 | TBD | Top 10 |
| combo on-grid | 890-2,100 | Transactional | 6/10 | TBD | Top 5 |
| combo hybrid | 780-1,900 | Transactional | 6/10 | TBD | Top 5 |
| hệ thống điện mặt trời | 2,100-4,500 | Informational | 6/10 | TBD | Top 10 |
| solar panel giá | 1,200-2,800 | Transactional | 7/10 | TBD | Top 15 |

#### Secondary Keywords (P1 - Medium Priority)

| Keyword | Volume | Intent | Opportunity |
|---------|--------|--------|-------------|
| lắp đặt điện mặt trời Hà Nội | 180-480 | Local TX | ✓ Local advantage |
| lắp điện mặt trời giá bao nhiêu | 1,400-3,200 | TX | ✓ Price content |
| on-grid solar | 680-1,500 | TX | ✓ Product pages |
| hybrid solar + pin | 450-1,200 | TX | ✓ BESS pages |
| EPC Solar Hà Nội | 280-620 | Navigational | ✓ Brand |

#### Competitor Analysis

**Competitor 1: SLMSolar.com**
- DA: 50-60 (High)
- Content: 50+ blog posts
- Backlinks: 400+ (DA>30)
- **Weakness:** National focus, not local
- **Our advantage:** Local Hà Nội focus, personalized service

**Competitor 2: SolarVN.com**
- DA: 40-50 (Medium)
- Content: 30-40 blog posts
- **Weakness:** Outdated design, slow mobile
- **Our advantage:** Modern Astro stack, better UX

---

### 1.3 Current Content Inventory

**Existing Pages (33 .astro files):**
- ✓ Homepage (index.astro) - với FAQ schema
- ✓ About, Contact, Lien-he
- ✓ Solutions: on-grid/[slug], hybrid-bess/[slug], solar-home/[slug]
- ✓ Applications: dien-cong-nghiep, dien-dan-dung, dien-nong-nghiep
- ✓ Equipment: index, [category], [...slug]
- ✓ Projects: index, [slug] (detailed project pages)
- ✓ Blog: index, [slug] (3 articles)
- ✓ FAQ, Bao-gia, Bao-tri
- ✓ Legal: privacy, terms
- ✓ Login, EV-charger, Solar-CI

**Content Collections (76 files):**
- ✓ 22 On-Grid combos (5kW - 97kW)
- ✓ 18 Hybrid combos (5kW - 24.4kW)
- ✓ 30+ products (inverters, batteries, panels, accessories)

**Blog Articles (3 published):**
1. chi-phi-lap-on-grid-ha-noi.md (229 lines)
2. on-grid-vs-hybrid.md (219 lines)
3. quy-trinh-lap-dat-solar.md (299 lines)

---

## 🚀 PHẦN 2: KẾ HOẠCH HÀNH ĐỘNG 90 NGÀY

### Phase 1: Technical Foundation (Tuần 1-2) - CRITICAL

#### Task 1.1: Image Optimization (Impact: LCP -2.1s)
**Priority:** P0 - CRITICAL  
**Effort:** 2-3 hours

**Action Items:**
- [ ] Convert hero-bg.png (1.72MB) → hero-bg.webp (~400KB)
  ```bash
  # Use Sharp or online converter
  npm install sharp
  ```
- [ ] Convert all hero variants:
  - hero-bg-768.webp (mobile)
  - hero-bg-1280.webp (tablet)
  - hero-bg-1920.webp (desktop)
- [ ] Implement `<picture>` element với srcset:
  ```html
  <picture>
    <source srcset="/hero-bg-768.webp" media="(max-width: 768px)" />
    <source srcset="/hero-bg-1280.webp" media="(max-width: 1280px)" />
    <source srcset="/hero-bg-1920.webp" />
    <img src="/hero-bg.webp" alt="Hệ thống điện mặt trời EPCVINA" 
         fetchpriority="high" width="1920" height="1080" />
  </picture>
  ```
- [ ] Add `loading="lazy"` cho all offscreen images
- [ ] Preload LCP image trong `<head>`:
  ```html
  <link rel="preload" as="image" href="/hero-bg-1920.webp" imagesrcset="..." />
  ```

**Expected Impact:** LCP 4.6s → 2.5s (-45%)

---

#### Task 1.2: Defer Render-Blocking CSS (Impact: FCP -1.35s)
**Priority:** P0 - CRITICAL  
**Effort:** 3-4 hours

**Action Items:**
- [ ] Extract critical CSS (above-fold content only)
- [ ] Inline critical CSS trong `<head>`
- [ ] Defer non-critical CSS:
  ```html
  <link rel="preload" href="/non-critical.css" as="style" 
        onload="this.onload=null;this.rel='stylesheet'" />
  <noscript><link rel="stylesheet" href="/non-critical.css" /></noscript>
  ```
- [ ] Split CSS trong astro.config.mjs:
  ```javascript
  build: {
    inlineStylesheets: 'auto',
  }
  ```
- [ ] Test với Lighthouse sau mỗi change

**Expected Impact:** FCP mobile 4.5s → 3.15s (-30%)

---

#### Task 1.3: Code Splitting & JS Optimization (Impact: -314KB JS)
**Priority:** P0 - HIGH  
**Effort:** 4-6 hours

**Action Items:**
- [ ] Move Supabase import chỉ vào pages cần thiết:
  ```javascript
  // ❌ Bad: Load everywhere
  import { supabase } from '@/lib/supabase';
  
  // ✅ Good: Dynamic import
  const { supabase } = await import('@/lib/supabase');
  ```
- [ ] Lazy-load Framer Motion:
  ```javascript
  // Chỉ load trên pages có animations
  const Motion = await import('framer-motion');
  ```
- [ ] Review React usage - ensure `client:load` chỉ khi cần:
  ```astro
  {/* ❌ Bad */}
  <Component client:load />
  
  {/* ✅ Good */}
  <Component client:visible />
  <Component client:idle />
  ```
- [ ] Update vite manualChunks trong astro.config.mjs (đã có sẵn)

**Expected Impact:** JS bundle -40%, TTI -15%

---

#### Task 1.4: Setup Google Search Console & GA4
**Priority:** P0 - CRITICAL  
**Effort:** 1-2 hours

**Action Items:**
- [ ] Tạo Google Search Console account
  - URL: https://search.google.com/search-console
  - Verify ownership (HTML file upload hoặc DNS record)
  - Submit sitemap: `https://epcvina.com/sitemap-index.xml`
  
- [ ] Tạo Google Analytics 4 property
  - URL: https://analytics.google.com
  - Get Measurement ID (G-XXXXXXXXXX)
  - Add tracking code vào DashboardLayout.astro
  
- [ ] Setup conversion tracking:
  - Contact form submissions
  - Phone clicks (0988 446 113)
  - Zalo clicks
  
- [ ] Configure goals trong GA4:
  - Organic traffic
  - Bounce rate by page
  - Conversion rate

**Deliverables:**
- ✓ GSC verified
- ✓ GA4 tracking live
- ✓ Conversion goals configured

---

### Phase 2: Content Expansion (Tuần 3-6) - HIGH IMPACT

#### Task 2.1: Create Pillar Pages (3-5 pages)
**Priority:** P0  
**Effort:** 2-3 weeks

**Pillar Page 1: /on-grid (3,000+ words)**
```markdown
H1: On-Grid Solar Là Gì? Hướng Dẫn Lắp Đặt & Chi Phí 2026
H2: On-Grid Solar Hoạt Động Như Thế Nào?
H2: Lợi Ích Của Hệ Thống On-Grid
H2: Chi Phí Lắp Đặt On-Grid Tại Hà Nội (2026)
H2: Quy Trình Lắp Đặt Chi Tiết
H2: On-Grid vs Hybrid: Nên Chọn Cái Nào?
H2: FAQ - Câu Hỏi Thường Gặp
H2: Liên Hệ Tư Vấn Miễn Phí
```

**Pillar Page 2: /hybrid (3,500+ words)**
```markdown
H1: Hybrid Solar + Pin Lưu Trữ: Điện Mặt Trời 24/7
H2: Hybrid Solar Là Gì? Khác On-Grid Chỗ Nào?
H2: BESS (Battery Energy Storage System)
H2: Chi Phí Đầu Tư Hybrid (2026)
H2: Top 5 Thương Hiệu Pin Lưu Trữ Tốt Nhất
H2: Bảo Trì Hệ Thống Hybrid
H2: Case Study: Lắp Hybrid Tại Tây Hồ
```

**Pillar Page 3: /bao-tri (2,500+ words)**
```markdown
H1: Bảo Dưỡng Hệ Thống Điện Mặt Trời: Hướng Dẫn A-Z
H2: Tại Sao Cần Bảo Dưỡng Định Kỳ?
H2: Tần Suất Bảo Dưỡng Khuyến Nghị
H2: Tự Bảo Dưỡng vs Thuê Chuyên Gia
H2: Chi Phí Bảo Dưỡng (2026)
H2: Checklist Bảo Dưỡng Hàng Tháng
```

**Action Items:**
- [ ] Research competitor content (SLMSolar, SolarVN)
- [ ] Write pillar pages với keyword optimization
- [ ] Add internal links (3-5 per page)
- [ ] Include images với alt text
- [ ] Add FAQ schema cho mỗi pillar

---

#### Task 2.2: Blog Content Calendar (8 posts/month)
**Priority:** P0  
**Effort:** Ongoing

**Tháng 6-7 Content Plan:**

| Week | Title | Keyword Focus | Word Count |
|------|-------|---------------|------------|
| W3 | "Chi Phí Lắp On-Grid 5kWp Hà Nội 2026" | lắp điện mặt trời giá | 2,000 |
| W3 | "5 Lý Do Chọn EPCVINA Solar" | EPC Solar uy tín | 1,500 |
| W4 | "Quy Trình Lắp Đặt Solar Từ A-Z" | quy trình lắp solar | 2,500 |
| W4 | "On-Grid vs Hybrid: So Sánh Chi Tiết" | on-grid vs hybrid | 2,000 |
| W5 | "Bao Lâu Hoàn Vốn Điện Mặt Trời?" | hoàn vốn solar | 2,000 |
| W5 | "Top 5 Inverter Tốt Nhất 2026" | inverter nào tốt | 1,800 |
| W6 | "Bảo Dưỡng Tấm Pin Mặt Trời Đúng Cách" | bảo dưỡng solar | 1,500 |
| W6 | "Case Study: Anh Hùng Tây Hồ Tiết Kiệm 3M/Tháng" | case study | 1,500 |

**Content Checklist (cho mỗi bài):**
- [ ] Primary keyword trong H1
- [ ] Primary keyword trong 100 từ đầu
- [ ] 3-5 H2 với secondary keywords
- [ ] 3-5 internal links
- [ ] 2-3 external links (high authority)
- [ ] 2-3 images với alt text
- [ ] Meta description 150-160 chars
- [ ] Title 50-60 chars
- [ ] FAQ section (3-5 questions)
- [ ] CTA cuối bài

---

#### Task 2.3: FAQ Page (Comprehensive)
**Priority:** P1  
**Effort:** 4-6 hours

**Structure:**
```markdown
H1: Câu Hỏi Thường Gặp - Lắp Đặt Điện Mặt Trời
Section 1: Chung (10 questions)
Section 2: On-Grid (8 questions)
Section 3: Hybrid (8 questions)
Section 4: Chi Phí & Hoàn Vốn (6 questions)
Section 5: Bảo Trì & Bảo Hành (5 questions)
Section 6: Pháp Lý & Giấy Phép (4 questions)
```

**Action Items:**
- [ ] Research 40+ common questions
- [ ] Write detailed answers (150-300 words each)
- [ ] Add FAQPage schema markup
- [ ] Link to relevant blog posts
- [ ] Internal linking từ homepage

---

#### Task 2.4: Case Studies (3-5 projects)
**Priority:** P1  
**Effort:** 1-2 weeks

**Template:**
```markdown
# Case Study: [Customer Name] - [Location]
## Problem
- Khách hàng gặp vấn đề gì?
- Hóa đơn điện trước đây?

## Solution
- Hệ thống nào được lắp? (On-Grid/Hybrid, công suất)
- Thiết bị sử dụng?
- Thời gian lắp đặt?

## Results
- Tiết kiệm hàng tháng?
- ROI calculation
- Customer testimonial (quote)
- Before/After photos

## Technical Details
- Equipment list
- Installation timeline
- Maintenance plan
```

**Action Items:**
- [ ] Select 3-5 best projects từ data-epvvn
- [ ] Interview customers (phone/Zalo)
- [ ] Take photos (before/after)
- [ ] Write case studies với real data
- [ ] Add to `/du-an` pages
- [ ] Link từ homepage & blog

---

### Phase 3: Local SEO (Tuần 4-8)

#### Task 3.1: Google Business Profile Optimization
**Priority:** P0  
**Effort:** 3-4 hours

**Action Items:**
- [ ] Claim/verify listing: https://business.google.com
- [ ] Optimize profile:
  - **Business Name:** "EPCVINA Solar - Công ty Cổ phần Xây lắp EPC Việt Nam"
  - **Category:** "Solar Energy Equipment Supplier" + "Electrical Installation Company"
  - **Description (250 chars):** "Chuyên lắp đặt điện mặt trời on-grid & hybrid trọn gói tại Hà Nội. 500+ dự án. Bảo hành 25 năm. Tư vấn miễn phí. Hotline: 0988 446 113."
  
- [ ] Complete all fields:
  - ✓ Phone: +84 988 446 113
  - ✓ Email: epcvina@hotmail.com
  - ✓ Website: https://epcvina.com
  - ✓ Address: Phòng 315 - Khu TM Chung cư HVQP, Nguyễn Văn Huyên Kéo Dài, Tây Hồ, Hà Nội
  - ✓ Hours: Mon-Sat 08:00-17:30
  
- [ ] Add 20+ photos:
  - Office/showroom (3-5)
  - Project installations (10-15)
  - Team photos (3-5)
  
- [ ] Post updates 2-4/month:
  - New blog posts
  - Project completions
  - Promotions
  - Customer testimonials

---

#### Task 3.2: Review Generation Strategy
**Priority:** P1  
**Effort:** Ongoing

**Action Items:**
- [ ] Send review requests to 20 past customers
  - Email template with direct GBP review link
  - Zalo message template
  - SMS template
  
- [ ] Respond to ALL reviews within 24h:
  - Positive reviews: Thank + mention keywords naturally
  - Negative reviews: Apologize + offer solution
  
- [ ] Target: 50+ reviews, 4.5+ stars by Month 3

**Email Template:**
```
Subject: Chia sẻ trải nghiệm lắp điện mặt trời tại EPCVINA

Kính chào [Customer Name],

Cảm ơn anh/chị đã tin tưởng EPCVINA Solar! 

Nếu anh/chị hài lòng với dịch vụ, xin vui lòng dành 2 phút 
đánh giá trên Google giúp chúng tôi:
[Link GBP review]

Mỗi đánh giá giúp chúng tôi phục vụ khách hàng tốt hơn.

Trân trọng,
EPCVINA Solar Team
```

---

#### Task 3.3: Local Citations & Directories
**Priority:** P1  
**Effort:** 5-8 hours

**Target Directories:**

| Directory | Priority | Action |
|-----------|----------|--------|
| Google Business | P0 | ✓ Optimize (Task 3.1) |
| Facebook Business | P0 | Create/optimize page |
| Zalo Official Account | P0 | Already exists |
| Yelp | P1 | Create listing |
| Yellow Pages Vietnam | P1 | Submit info |
| Hotfrog Vietnam | P2 | Submit info |
| Energy industry dirs | P2 | Research & submit |

**Action Items:**
- [ ] Create/optimize 5 directory listings
- [ ] Ensure NAP consistency (Name, Address, Phone)
- [ ] Add website link trong mỗi listing
- [ ] Add photos where possible

---

### Phase 4: Link Building (Tuần 6-12)

#### Task 4.1: Internal Linking Optimization
**Priority:** P0  
**Effort:** 3-4 hours

**Pillar-Cluster Structure:**
```
Homepage
├─ /on-grid (pillar)
│  ├─ Blog: Chi phí on-grid 5kW
│  ├─ Blog: Quy trình lắp đặt
│  └─ Blog: On-grid vs Hybrid
├─ /hybrid (pillar)
│  ├─ Blog: Pin lưu trữ nào tốt
│  ├─ Blog: Bảo trì hybrid
│  └─ Case Study: Tây Hồ
└─ /bao-tri (pillar)
   ├─ Blog: Vệ sinh tấm pin
   └─ Blog: Kiểm tra inverter
```

**Action Items:**
- [ ] Add internal links trong tất cả blog posts (3-5 links)
- [ ] Link từ pillar → cluster pages
- [ ] Link từ cluster → pillar pages
- [ ] Related posts section ở cuối mỗi blog
- [ ] Breadcrumb navigation với schema

---

#### Task 4.2: External Link Building Strategy
**Priority:** P2  
**Effort:** Ongoing

**Target: 50+ backlinks (DA>30) trong 6 tháng**

**Tactics:**

**1. Create Linkable Assets**
- [ ] Solar Cost Calculator (interactive tool)
- [ ] "State of Solar in Vietnam 2026" report
- [ ] Infographic: On-Grid vs Hybrid
- [ ] Downloadable PDF guide

**2. Guest Posting (2-3/month)**
- [ ] Target: solar blogs, energy sites, home improvement
- [ ] Include author bio với backlink
- [ ] Link: https://epcvina.com

**3. Press Releases**
- [ ] Major project completions
- [ ] New service launches
- [ ] Partnership announcements
- [ ] Distribute on PR sites

**4. Partnership Links**
- [ ] Equipment manufacturers (Deye, SAJ, Hopetrek)
- [ ] Referral partners
- [ ] University research collaborations

**5. Broken Link Building**
- [ ] Find broken links trên competitor sites
- [ ] Create equivalent content
- [ ] Reach out với suggestion

---

## 📊 PHẦN 3: KPIs & MONITORING

### 3.1 Success Metrics (90-Day Targets)

| Metric | Current | 30 Days | 60 Days | 90 Days |
|--------|---------|---------|---------|---------|
| Performance Score | 66/100 | 75/100 | 85/100 | 90+/100 |
| LCP (mobile) | 4.6s | 3.5s | 2.8s | <2.5s |
| FCP (mobile) | 4.5s | 3.5s | 2.5s | <1.8s |
| Blog Posts | 3 | 8 | 16 | 25+ |
| Organic Sessions/mo | TBD | +25% | +75% | +150% |
| Keywords Top 10 | TBD | 2-3 | 5-8 | 10+ |
| GBP Reviews | TBD | 20+ | 35+ | 50+ |
| Backlinks (DA>30) | TBD | 5+ | 20+ | 50+ |

### 3.2 Monitoring Tools Setup

**Essential (Free):**
- [ ] Google Search Console - rankings, impressions, clicks
- [ ] Google Analytics 4 - traffic, conversions, behavior
- [ ] PageSpeed Insights - Core Web Vitals monitoring
- [ ] Lighthouse (Chrome DevTools) - monthly audits

**Recommended (Paid):**
- [ ] Semrush ($99/mo) - rank tracking, competitor analysis
- [ ] Ahrefs ($99/mo) - backlink monitoring, keyword research

**Dashboard Setup:**
```
Monthly SEO Report Template:
├─ Organic Traffic (GSC + GA4)
│  ├─ Sessions by source
│  ├─ Top landing pages
│  └─ Conversion rate
├─ Keyword Rankings (Semrush)
│  ├─ Top 20 keywords position
│  ├─ New keywords entering Top 50
│  └─ Competitor comparison
├─ Technical Health
│  ├─ Core Web Vitals scores
│  ├─ Crawl errors
│  └─ Index coverage
├─ Link Profile
│  ├─ New backlinks
│  ├─ Domain authority
│  └─ Referring domains
└─ Action Items
   ├─ What worked
   ├─ What needs improvement
   └─ Next month priorities
```

### 3.3 Weekly Review Checklist

**Week 1-2:**
- [ ] GSC: Check impressions, clicks, CTR
- [ ] GA4: Organic sessions, bounce rate
- [ ] PageSpeed: Core Web Vitals scores
- [ ] Fix any critical errors

**Week 3-4:**
- [ ] Content audit: Which pages perform best?
- [ ] Internal links: Verify structure
- [ ] GBP: Check reviews, respond to all
- [ ] Competitor rankings

**Monthly:**
- [ ] Full Lighthouse audit
- [ ] Content performance review
- [ ] Backlink analysis
- [ ] Update SEO action plan

---

## ⚠️ PHẦN 4: RISK MITIGATION

### 4.1 Common SEO Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Google algorithm update | High | Follow guidelines, focus on UX |
| Competitor outrank | High | Local focus, better content |
| Technical issues | Medium | Monthly audits, monitoring |
| Slow content production | High | Content calendar, delegate |
| Low-quality backlinks | Medium | Only DA>30, white-hat only |
| Core Web Vitals degradation | Medium | Performance budgets, CI checks |

### 4.2 Red Flags to Monitor

- 🚨 Sudden traffic drop (>20% week-over-week)
- 🚨 Increase in 404 errors
- 🚨 High bounce rate on specific pages (>80%)
- 🚨 Decline in backlinks or toxic links
- 🚨 Manual actions trong GSC
- 🚨 Core Web Vitals dropping below threshold

---

## 💰 PHẦN 5: BUDGET & RESOURCES

### 5.1 Recommended Budget (Monthly)

| Category | Amount (USD) | % |
|----------|--------------|---|
| Content Creation | $800-1,200 | 40% |
| Link Building & Outreach | $500-750 | 25% |
| SEO Tools | $200-400 | 15% |
| Video Production | $300-450 | 15% |
| Contingency | $100-200 | 5% |
| **Total** | **$1,900-3,000** | 100% |

### 5.2 Team Roles

| Role | Responsibility | Time |
|------|----------------|------|
| SEO Specialist | Strategy, monitoring, optimization | 10h/week |
| Content Writer | Blog posts, pillar pages, case studies | 20h/week |
| Developer | Technical SEO, performance, schema | 5h/week |
| Designer | Images, infographics, videos | 5h/week |

---

## 📋 PHẦN 6: QUICK WINS (First 2 Weeks)

### Priority 1: Performance (Days 1-3)
- [ ] Convert hero images to WebP (2 hours)
- [ ] Add lazy loading to offscreen images (30 min)
- [ ] Preload LCP image (30 min)

**Expected:** LCP -1.5s, Performance +10 points

### Priority 2: Tracking (Days 1-2)
- [ ] Setup Google Search Console (1 hour)
- [ ] Setup Google Analytics 4 (1 hour)
- [ ] Verify sitemap submission (30 min)

**Expected:** Baseline metrics established

### Priority 3: Content (Days 3-7)
- [ ] Write 2 blog posts (4,000 words total)
- [ ] Optimize homepage meta tags (30 min)
- [ ] Add internal links to existing pages (1 hour)

**Expected:** +2 new indexed pages

### Priority 4: Local SEO (Days 5-10)
- [ ] Optimize GBP profile (2 hours)
- [ ] Add 10 photos to GBP (1 hour)
- [ ] Request 10 customer reviews (30 min)

**Expected:** GBP score +30%, more local visibility

---

## 🎯 KẾT LUẬN

### Current Status Summary

**✅ What's Working:**
- Solid Astro technical foundation
- Comprehensive schema markup
- Good content structure (76 products/combos)
- Vietnamese-first content strategy

**❌ What Needs Immediate Action:**
- 🔴 Performance optimization (LCP 4.6s → 2.5s)
- 🔴 Content expansion (3 → 25+ blog posts)
- 🔴 Google Search Console & GA4 setup
- 🟡 Local SEO optimization
- 🟡 Link building strategy

### 90-Day Success Criteria

By September 23, 2026:
- ✓ Performance score 90+ (mobile & desktop)
- ✓ 25+ blog posts published
- ✓ 10+ keywords in Google Top 10
- ✓ 5,000+ organic sessions/month
- ✓ 50+ Google reviews (4.5+ stars)
- ✓ 50+ quality backlinks
- ✓ GBP fully optimized

### Next Steps (This Week)

1. **Day 1-2:** Convert hero images, setup GSC/GA4
2. **Day 3-4:** Defer CSS, optimize JS bundles
3. **Day 5-7:** Write 2 blog posts, optimize GBP
4. **Week 2:** Continue content production, start link outreach

---

**Document Version:** 1.0  
**Created:** June 23, 2026  
**Next Review:** July 23, 2026  
**Owner:** EPCVINA Marketing Team

**Contact:**
- Hotline: 0988 446 113
- Email: epcvina@hotmail.com
- Website: https://epcvina.com

---

## Phụ Lục A: Technical Implementation Details

### A.1 Image Optimization Script

```javascript
// scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';

const inputDir = './public';
const outputDir = './public/optimized';

async function optimizeImages() {
  await mkdir(outputDir, { recursive: true });
  
  const files = await readdir(inputDir);
  
  for (const file of files) {
    if (file.match(/\.(png|jpg|jpeg)$/i)) {
      const inputPath = `${inputDir}/${file}`;
      const baseName = file.replace(/\.[^/.]+$/, '');
      
      // Generate WebP at multiple sizes
      await sharp(inputPath)
        .resize(1920, null, { fit: 'inside' })
        .webp({ quality: 85 })
        .toFile(`${outputDir}/${baseName}-1920.webp`);
      
      await sharp(inputPath)
        .resize(1280, null, { fit: 'inside' })
        .webp({ quality: 85 })
        .toFile(`${outputDir}/${baseName}-1280.webp`);
      
      await sharp(inputPath)
        .resize(768, null, { fit: 'inside' })
        .webp({ quality: 85 })
        .toFile(`${outputDir}/${baseName}-768.webp`);
      
      console.log(`✓ Optimized: ${file}`);
    }
  }
}

optimizeImages();
```

### A.2 Critical CSS Extraction

```bash
# Install critical CSS tool
npm install -D critical

# Extract critical CSS
npx critical https://epcvina.com --base dist/ \
  --inline \
  --minify \
  --width 1300 \
  --height 900 \
  --output dist/critical.css
```

### A.3 Performance Budget (astro.config.mjs)

```javascript
// Add to astro.config.mjs
export default defineConfig({
  // ... existing config
  
  vite: {
    build: {
      // Performance budgets
      chunkSizeWarningLimit: 500, // kB
      
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Vendor splitting (already implemented)
            if (id.includes('node_modules/react')) return 'react-vendor';
            if (id.includes('node_modules/framer-motion')) return 'framer-motion';
            if (id.includes('node_modules/recharts')) return 'recharts';
            if (id.includes('node_modules/@supabase')) return 'supabase';
          }
        }
      }
    }
  }
});
```

---

## Phụ Lục B: Content Templates

### B.1 Blog Post Template

```markdown
---
title: "[Bài Viết] - EPCVINA Solar"
description: "Mô tả 150-160 ký tự với keyword chính"
pubDate: "2026-06-23"
author: "EPCVINA Team"
category: "Hướng Dẫn"
tags: ["keyword1", "keyword2", "keyword3"]
image: "/images/blog/[slug].webp"
---

# H1: [Title với primary keyword]

[Introduction: 150-200 words với primary keyword trong 100 từ đầu]

## H2: [Subtopic 1]

[Content với LSI keywords]

## H2: [Subtopic 2]

[Content]

## H2: FAQ - Câu Hỏi Thường Gặp

### H3: [Question 1]?
[Answer 150-200 words]

### H3: [Question 2]?
[Answer]

## H2: Kết Luận

[Summary + CTA]

**Liên hệ tư vấn miễn phí:**
- Hotline: 0988 446 113
- Website: https://epcvina.com/lien-he
```

### B.2 Case Study Template

```markdown
---
title: "Case Study: [Customer] - [Location]"
description: "How [Customer] saved [X] million/month with EPCVINA"
pubDate: "2026-06-23"
category: "Case Study"
---

# Case Study: [Customer Name] - [Location]

## Problem
- Monthly electricity bill: [X] million VND
- Pain points: [list]

## Solution
- System: [On-Grid/Hybrid, X kWp]
- Equipment: [Panels, Inverter, Battery]
- Installation time: [X days]

## Results
- Monthly savings: [X] million VND (Y% reduction)
- ROI: [X] years
- CO2 reduced: [X] kg/year

## Customer Testimonial

> "[Quote từ khách hàng]"
> 
> — [Customer Name], [Location]

## Photos
- Before/After images
- System installation

## Technical Specs
[Table với equipment details]

---

**Interested in similar savings?**
[CTA: Contact form link]
```

---

**END OF DOCUMENT**
