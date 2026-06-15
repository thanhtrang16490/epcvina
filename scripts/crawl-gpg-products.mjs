// Script to crawl products from gpgsolar.vn
// Usage: node --experimental-specifier-resolution=node scripts/crawl-gpg-products.mjs

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://gpgsolar.vn';

async function crawlProducts() {
  console.log('🚀 Starting GPG Solar product crawler...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
  
  try {
    // Navigate to products page
    console.log('📄 Navigating to products page...');
    await page.goto(`${BASE_URL}/san-pham`, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for products to load
    await page.waitForSelector('.product-item, .woocommerce-product, .product', { timeout: 10000 })
      .catch(() => console.log('⚠️  Product selector not found, trying generic crawl'));
    
    // Extract product links
    const productLinks = await page.evaluate(() => {
      const links = [];
      // Try different selectors for WooCommerce/WordPress
      const selectors = [
        '.product a.woocommerce-LoopProduct-link',
        '.product-item a',
        'a[href*="san-pham/"]'
      ];
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          elements.forEach(el => {
            const href = el.href;
            if (href && !links.includes(href)) {
              links.push(href);
            }
          });
          break;
        }
      }
      
      return links.slice(0, 50); // Limit to 50 products
    });
    
    console.log(`📦 Found ${productLinks.length} product links`);
    
    // Crawl each product page
    const products = [];
    for (let i = 0; i < productLinks.length; i++) {
      const link = productLinks[i];
      console.log(`\n[${i + 1}/${productLinks.length}] Crawling: ${link}`);
      
      try {
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 20000 });
        
        const productData = await page.evaluate((url) => {
          // Extract product information
          const title = document.querySelector('h1.product_title, h1.entry-title')?.textContent?.trim();
          const price = document.querySelector('.price, .woocommerce-Price-amount')?.textContent?.trim();
          const description = document.querySelector('.woocommerce-Tabs-panel--description, .entry-content p')?.textContent?.trim();
          const image = document.querySelector('.woocommerce-product-gallery__image img, .wp-post-image')?.src;
          
          // Extract specifications from table
          const specs = {};
          document.querySelectorAll('table.woocommerce-product-attributes tr').forEach(row => {
            const key = row.querySelector('th')?.textContent?.trim();
            const value = row.querySelector('td')?.textContent?.trim();
            if (key && value) {
              specs[key] = value;
            }
          });
          
          return {
            name: title || 'Unknown',
            price: price || '0',
            description: description || '',
            image: image || '',
            specifications: specs,
            source_url: url
          };
        }, link);
        
        products.push(productData);
        console.log(`✅ ${productData.name}`);
        
      } catch (error) {
        console.error(`❌ Error crawling ${link}:`, error.message);
      }
      
      // Be polite - delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Save to JSON file
    const outputPath = path.join(process.cwd(), 'scripts', 'gpg-products-raw.json');
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
    console.log(`\n✅ Saved ${products.length} products to ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Crawl error:', error.message);
  } finally {
    await browser.close();
  }
}

crawlProducts().catch(console.error);
