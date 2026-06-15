// Parse products from GPG Solar HTML file and create Markdown content
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFile = path.join(__dirname, '..', 'data', 'Sản phẩm điện mặt trời _ GPG Solar.html');
const htmlContent = fs.readFileSync(htmlFile, 'utf-8');

console.log('📝 Parsing GPG Solar products from HTML...\n');

// Create output directory
const outputDir = path.join(__dirname, '..', 'astro-solar', 'src', 'content', 'products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
} else {
  // Clear existing
  fs.readdirSync(outputDir).forEach(file => {
    const filePath = path.join(outputDir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true });
    } else {
      fs.unlinkSync(filePath);
    }
  });
}

// Extract product data using regex
// Look for product cards with name, price, image, etc.
const productRegex = /<a[^>]*href="\/san-pham\/([^"]+)"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[^>]*>[\s\S]*?<h[23][^>]*>([^<]+)<\/h[23]>[\s\S]*?(?:<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/span>)?/gi;

const products = [];
let match;

while ((match = productRegex.exec(htmlContent)) !== null) {
  const slug = match[1];
  const image = match[2];
  const name = match[3].trim();
  const price = match[4] || '0';
  
  if (name && name.length > 5 && name.length < 200) {
    products.push({
      slug,
      image,
      name,
      price: price.includes('Liên hệ') ? 0 : parseInt(price.replace(/\D/g, '')) || 0,
    });
  }
}

console.log(`📊 Found ${products.length} products in HTML\n`);

// Group by category (detect from name)
const categorizeProduct = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('tấm pin') || lower.includes('module') || lower.includes('aiko')) return 'panel';
  if (lower.includes('biến tần') || lower.includes('inverter')) {
    if (lower.includes('hybrid')) return 'hybrid-inverter';
    if (lower.includes('1 pha')) return 'on-grid-1phase';
    if (lower.includes('3 pha')) return 'on-grid-3phase-lv';
    return 'hybrid-inverter';
  }
  if (lower.includes('pin lưu') || lower.includes('battery') || lower.includes('lithium')) return 'lv-battery';
  if (lower.includes('cáp') || lower.includes('dây') || lower.includes('mc4')) return 'wiring';
  if (lower.includes('tủ điện') || lower.includes('cabinet')) return 'cabinet';
  if (lower.includes('khung') || lower.includes('mount')) return 'mounting';
  if (lower.includes('tiếp địa') || lower.includes('ground')) return 'grounding';
  return 'other';
};

// Create markdown files
const byCategory = {};
products.forEach(product => {
  const category = categorizeProduct(product.name);
  if (!byCategory[category]) byCategory[category] = [];
  byCategory[category].push(product);
});

let totalCreated = 0;
Object.entries(byCategory).forEach(([category, categoryProducts]) => {
  const categoryDir = path.join(outputDir, category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  categoryProducts.forEach((product, index) => {
    const filename = `${product.slug}.md`;
    const filepath = path.join(categoryDir, filename);

    // Detect brand
    const brand = product.name.includes('AIKO') ? 'AIKO' 
      : product.name.includes('LEADER') ? 'LEADER'
      : product.name.includes('HOPETREK') ? 'HOPETREK'
      : product.name.includes('SAJ') ? 'SAJ'
      : product.name.includes('GENIXGREEN') ? 'GENIXGREEN'
      : product.name.includes('HUAWEI') ? 'HUAWEI'
      : product.name.includes('GROWATT') ? 'GROWATT'
      : product.name.includes('PYLONTECH') ? 'PYLONTECH'
      : 'EPCVINA';

    // Extract model from name
    const modelMatch = product.name.match(/\b[A-Z0-9]{3,}-[A-Z0-9-]+\b/i);
    const model = modelMatch ? modelMatch[0] : '';

    const mdContent = `---
name: "${product.name.replace(/"/g, '\\"')}"
brand: "${brand}"
category: "${category}"
model: "${model}"
description: "${product.name.replace(/"/g, '\\"')} - Sản phẩm chính hãng từ ${brand}"
${product.price > 0 ? `price: ${product.price}` : ''}
main_image: "${product.image}"
is_available: true
---

<!-- Product details -->
`;

    fs.writeFileSync(filepath, mdContent, 'utf-8');
    totalCreated++;
    console.log(`✅ ${category}/${filename}`);
  });
});

console.log(`\n🎉 Successfully created ${totalCreated} product Markdown files!`);
console.log(`📁 Output: ${outputDir}`);
console.log(`\n📊 Category breakdown:`);
Object.entries(byCategory).forEach(([cat, prods]) => {
  console.log(`   ${cat}: ${prods.length} products`);
});
