// Crawl GPG Solar products using Playwright (supports NextJS/JavaScript)
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://gpgsolar.vn';

async function crawlGPGSolar() {
  console.log('🚀 Starting GPG Solar crawler with Playwright...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to products page
    console.log('📄 Navigating to products page...');
    await page.goto(`${BASE_URL}/san-pham`, { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Wait for products to load
    await page.waitForTimeout(3000);
    
    // Take screenshot to debug
    await page.screenshot({ path: 'scripts/debug-products-page.png' });
    console.log('📸 Screenshot saved to scripts/debug-products-page.png');
    
    // Extract product cards
    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.product, .product-item, [class*="product-card"], a[href*="san-pham/"]');
      console.log('Found elements:', productElements.length);
      
      const products = [];
      productElements.forEach((el) => {
        const link = el.tagName === 'A' ? el : el.querySelector('a[href*="san-pham/"]');
        if (!link) return;
        
        const href = link.href;
        const title = el.querySelector('h2, h3, .product-title, [class*="title"]')?.textContent?.trim();
        const price = el.querySelector('.price, .woocommerce-Price, [class*="price"]')?.textContent?.trim();
        const image = el.querySelector('img')?.src;
        
        if (title && title.length < 200) { // Filter out navigation text
          products.push({
            name: title,
            price: price || 'Liên hệ',
            image: image || '',
            url: href
          });
        }
      });
      
      return products;
    });
    
    console.log(`\n✅ Found ${products.length} products:`);
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - ${p.price}`);
    });
    
    // Crawl each product detail page
    console.log('\n🔍 Crawling product details...');
    const detailedProducts = [];
    
    for (let i = 0; i < Math.min(products.length, 10); i++) {
      const product = products[i];
      console.log(`\n[${i + 1}/${Math.min(products.length, 10)}] Crawling: ${product.name}`);
      
      try {
        await page.goto(product.url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        // Take screenshot of product page
        await page.screenshot({ path: `scripts/debug-product-${i + 1}.png` });
        
        const detail = await page.evaluate((url) => {
          // Extract product details
          const title = document.querySelector('h1.product_title, h1.entry-title, h1')?.textContent?.trim();
          const price = document.querySelector('.price, .woocommerce-Price-amount')?.textContent?.trim();
          const description = document.querySelector('.woocommerce-Tabs-panel--description, .entry-content p')?.textContent?.trim();
          const images = Array.from(document.querySelectorAll('.woocommerce-product-gallery__image img, img.wp-post-image'))
            .map(img => img.src);
          
          // Extract specifications
          const specs = {};
          document.querySelectorAll('table.woocommerce-product-attributes tr, .specifications tr').forEach(row => {
            const key = row.querySelector('th')?.textContent?.trim();
            const value = row.querySelector('td')?.textContent?.trim();
            if (key && value) {
              specs[key] = value;
            }
          });
          
          return {
            name: title,
            price: price,
            description: description,
            images: images,
            specifications: specs,
            source_url: url
          };
        }, product.url);
        
        detailedProducts.push(detail);
        console.log(`✅ ${detail.name}`);
        
      } catch (error) {
        console.error(`❌ Error crawling ${product.url}:`, error.message);
      }
      
      // Be polite - delay between requests
      await page.waitForTimeout(2000);
    }
    
    // Save to JSON file
    const outputPath = path.join(process.cwd(), 'scripts', 'gpg-products-detailed.json');
    fs.writeFileSync(outputPath, JSON.stringify(detailedProducts, null, 2));
    console.log(`\n✅ Saved ${detailedProducts.length} detailed products to ${outputPath}`);
    
    // Also save simple list
    const simplePath = path.join(process.cwd(), 'scripts', 'gpg-products-list.json');
    fs.writeFileSync(simplePath, JSON.stringify(products, null, 2));
    console.log(`✅ Saved ${products.length} products list to ${simplePath}`);
    
  } catch (error) {
    console.error('❌ Crawl error:', error.message);
  } finally {
    await browser.close();
  }
}

crawlGPGSolar().catch(console.error);
