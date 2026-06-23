# 🔧 Google Search Console & Analytics 4 Setup Guide
## EPCVINA Solar - Step-by-Step Instructions

**Date:** June 23, 2026  
**Website:** https://epcvina.com

---

## 📊 PART 1: Google Search Console Setup (30 minutes)

### Step 1: Create Google Search Console Account

1. Go to: **https://search.google.com/search-console**
2. Sign in with your Google account (preferably your business Gmail)
3. Click **"Add property"** in the top-left corner

### Step 2: Add Your Property

You have TWO options to verify ownership:

#### Option A: URL Prefix (Recommended for beginners)
1. Select **"URL prefix"** tab
2. Enter: `https://epcvina.com`
3. Click **"Continue"**

#### Option B: Domain (Recommended for advanced users)
1. Select **"Domain"** tab
2. Enter: `epcvina.com`
3. Click **"Continue"**
4. You'll need to add a DNS TXT record to your domain provider

### Step 3: Verify Ownership (URL Prefix Method)

**Method 1: HTML File Upload (Easiest)**

1. Choose **"HTML file"** verification method
2. Download the verification file (e.g., `google1234567890.html`)
3. Place the file in: `/epcvinasolar/public/google1234567890.html`
4. Deploy your site to production
5. Verify the file is accessible: `https://epcvina.com/google1234567890.html`
6. Click **"Verify"** in Search Console

**Method 2: HTML Tag**

1. Choose **"HTML tag"** verification method
2. Copy the meta tag (looks like: `<meta name="google-site-verification" content="YOUR_CODE" />`)
3. Add to `DashboardLayout.astro` in the `<head>` section:
   ```astro
   <meta name="google-site-verification" content="YOUR_CODE_HERE" />
   ```
4. Deploy and click **"Verify"**

**Method 3: DNS Record (for Domain property)**

1. Copy the TXT record value from Search Console
2. Go to your DNS provider (Cloudflare, Namecheap, etc.)
3. Add a TXT record:
   - **Type:** TXT
   - **Name:** @ (or leave blank)
   - **Value:** `google-site-verification=YOUR_CODE`
   - **TTL:** Auto or 3600
4. Wait 5-60 minutes for DNS propagation
5. Click **"Verify"**

### Step 4: Submit Sitemap

1. In Search Console, go to **"Sitemaps"** in the left sidebar
2. Enter: `sitemap-index.xml`
3. Click **"Submit"**
4. Verify status shows **"Success"**

**Expected sitemap URLs:**
- `https://epcvina.com/sitemap-index.xml`
- `https://epcvina.com/sitemap-0.xml`

### Step 5: Request Indexing for Key Pages

Use the **URL Inspection Tool**:

1. Click **"Inspect any URL"** at the top
2. Enter each URL and click **"Request indexing"**:
   - [ ] `https://epcvina.com/` (Homepage)
   - [ ] `https://epcvina.com/on-grid`
   - [ ] `https://epcvina.com/hybrid-bess`
   - [ ] `https://epcvina.com/solar-home`
   - [ ] `https://epcvina.com/contact`
   - [ ] `https://epcvina.com/about`
   - [ ] `https://epcvina.com/equipment`
   - [ ] `https://epcvina.com/du-an`
   - [ ] `https://epcvina.com/blog`

### Step 6: Monitor Performance

Check these sections weekly:

**Coverage Report:**
- Look for errors (red)
- Fix any "Submitted URL not found (404)" issues
- Ensure important pages are "Indexed"

**Performance Report:**
- Track **Clicks**, **Impressions**, **CTR**, **Average Position**
- Filter by queries containing: "lắp đặt điện mặt trời", "on-grid", "hybrid"
- Identify top-performing pages

**Enhancements:**
- Check for structured data errors
- Verify FAQ schema is being detected
- Look for mobile usability issues

---

## 📈 PART 2: Google Analytics 4 Setup (30 minutes)

### Step 1: Create GA4 Property

1. Go to: **https://analytics.google.com**
2. Sign in with the same Google account
3. Click **"Start measuring"** or **"Create Property"**
4. Fill in:
   - **Property name:** EPCVINA Solar
   - **Reporting time zone:** Vietnam (GMT+7)
   - **Currency:** Vietnamese Đồng (VND)
5. Click **"Next"**

### Step 2: Business Details

1. **Industry category:** Home & Garden (or Business & Industrial)
2. **Business size:** 10-50 (or your actual size)
3. Click **"Create"**

### Step 3: Get Measurement ID

1. After creating, you'll see a setup wizard
2. Select **"Web"** as your platform
3. Enter:
   - **Website URL:** `https://epcvina.com`
   - **Stream name:** EPCVINA Solar Website
4. Click **"Create stream"**
5. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 4: Add GA4 Code to Website

The GA4 tracking code is **already added** to `DashboardLayout.astro`.

**You just need to:**

1. Open: `/epcvinasolar/src/layouts/DashboardLayout.astro`
2. Find line ~165 (search for `G-XXXXXXXXXX`)
3. Replace `G-XXXXXXXXXX` with your actual Measurement ID:
   ```javascript
   gtag('config', 'G-YOUR_ACTUAL_ID', {
   ```
4. Deploy the changes

### Step 5: Verify Tracking is Working

**Method 1: Realtime Report**

1. Go to GA4 → **Reports** → **Realtime**
2. Open your website in a new tab: `https://epcvina.com`
3. Browse a few pages
4. Check if you see active users in Realtime report (within 30 seconds)

**Method 2: Google Tag Assistant**

1. Install Chrome extension: **Tag Assistant Legacy**
2. Go to `https://epcvina.com`
3. Click Tag Assistant icon
4. Verify Google Tag is detected and green

**Method 3: GA4 DebugView**

1. In GA4, go to **Admin** → **Data Streams** → Your stream
2. Turn on **"DebugView"**
3. Browse your site
4. Check if events appear in DebugView

### Step 6: Setup Conversion Tracking

#### Conversion 1: Phone Number Clicks

Add `onclick` to phone links in your components:

```html
<a 
  href="tel:+84988446113" 
  onclick="trackPhoneClick()"
  className="..."
>
  0988 446 113
</a>
```

#### Conversion 2: Contact Form Submissions

Add to your contact form submit handler:

```javascript
function handleSubmit(e) {
  e.preventDefault();
  
  // Your form logic...
  
  // Track conversion
  if (typeof trackFormSubmit === 'function') {
    trackFormSubmit('contact_form');
  }
}
```

#### Conversion 3: Zalo Button Clicks

```html
<a 
  href="https://zalo.me/epcvina" 
  target="_blank"
  onclick="gtag('event', 'zalo_click', {
    'event_category': 'contact',
    'event_label': 'zalo_button'
  })"
>
  Chat Zalo
</a>
```

### Step 7: Mark Events as Conversions

1. In GA4, go to **Admin** → **Conversions**
2. Click **"New conversion event"**
3. Add these event names:
   - `phone_click`
   - `form_submit`
   - `zalo_click`
4. Click **"Save"**

### Step 8: Setup Custom Reports

**Report 1: Organic Traffic Overview**

1. Go to **Reports** → **Acquisition** → **Traffic acquisition**
2. Filter: **Session default channel group** = Organic Search
3. Save as custom report

**Report 2: Top Landing Pages**

1. Go to **Reports** → **Engagement** → **Pages and screens**
2. Add filter: **Page title and screen class**
3. Sort by **Views** or **Conversions**

**Report 3: Conversion Rate by Source**

1. Go to **Reports** → **Acquisition** → **Traffic acquisition**
2. Add secondary dimension: **Event count**
3. Filter by conversion events

---

## ✅ Verification Checklist

### Google Search Console
- [ ] Property created and verified
- [ ] Sitemap submitted (`sitemap-index.xml`)
- [ ] Sitemap status shows "Success"
- [ ] 9 key pages requested for indexing
- [ ] No critical errors in Coverage report
- [ ] Performance report shows data (wait 24-48 hours)

### Google Analytics 4
- [ ] Property created
- [ ] Measurement ID added to DashboardLayout.astro
- [ ] Code deployed to production
- [ ] Realtime report shows active users
- [ ] Tag Assistant shows green checkmark
- [ ] 3 conversion events configured
- [ ] Events marked as conversions in GA4

### Post-Setup (Wait 24-48 Hours)
- [ ] GSC shows impressions and clicks
- [ ] GA4 shows sessions and users
- [ ] Conversions are being tracked
- [ ] No errors in either platform

---

## 📊 What to Monitor Weekly

### Google Search Console (Every Monday)

**Performance Report:**
- Total clicks (week-over-week change)
- Total impressions
- Average CTR
- Average position
- Top 10 queries
- Top 10 pages

**Coverage Report:**
- Errors (fix immediately)
- Valid pages with warnings
- Excluded pages (check if intentional)

**Enhancements:**
- Structured data errors
- Mobile usability issues
- Core Web Vitals data

### Google Analytics 4 (Every Monday)

**Realtime:**
- Active users right now
- Top pages in last 30 minutes

**Acquisition:**
- Traffic by source (Organic, Direct, Social, Referral)
- New vs. Returning users
- User engagement time

**Engagement:**
- Top pages by views
- Average engagement time per page
- Bounce rate by page

**Conversions:**
- Total conversions
- Conversion rate by source
- Top converting pages

---

## 🔧 Troubleshooting

### GSC: Verification Failed

**Problem:** Can't verify ownership

**Solutions:**
1. Ensure verification file is in `/public` folder
2. Rebuild and redeploy site
3. Test URL: `https://epcvina.com/google1234567890.html`
4. Try HTML tag method instead
5. Clear browser cache and try again

### GSC: Sitemap Not Processing

**Problem:** Sitemap shows error

**Solutions:**
1. Verify URL: `https://epcvina.com/sitemap-index.xml`
2. Check if XML is valid (no syntax errors)
3. Ensure site is built with `npm run build`
4. Wait 24 hours and check again
5. Resubmit sitemap

### GA4: No Data in Realtime

**Problem:** Realtime report shows 0 users

**Solutions:**
1. Verify Measurement ID is correct (G-XXXXXXXXXX format)
2. Check browser console for errors
3. Disable ad blocker (may block GA4)
4. Verify script is in `<head>` not `<body>`
5. Wait 5-10 minutes after page load
6. Use GA4 DebugView to test

### GA4: Conversions Not Tracking

**Problem:** Conversion events not showing

**Solutions:**
1. Verify event names match exactly (case-sensitive)
2. Check browser console for JavaScript errors
3. Test with GA4 DebugView
4. Ensure onclick handlers are attached
5. Wait 24-48 hours for data to appear

---

## 📞 Need Help?

- **Google Search Console Help:** https://support.google.com/webmasters
- **GA4 Help:** https://support.google.com/analytics
- **GA4 Academy:** https://skillshop.withgoogle.com/product/ga4

---

**Next Steps:**
1. Complete GSC setup (30 min)
2. Complete GA4 setup (30 min)
3. Wait 24-48 hours for data
4. Review first reports
5. Continue with content creation tasks

**Version:** 1.0  
**Created:** June 23, 2026
