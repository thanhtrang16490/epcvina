// Parse GPG Solar products from downloaded HTML
import fs from 'fs';
import path from 'path';

const htmlFile = path.join(process.cwd(), 'data', 'Sản phẩm điện mặt trời _ GPG Solar.html');
const html = fs.readFileSync(htmlFile, 'utf-8');

console.log('📄 Reading GPG Solar HTML file...');
console.log('📊 File size:', (html.length / 1024).toFixed(2), 'KB');

// Try to find product data in JavaScript or HTML structure
// Look for common patterns

const patterns = [
  // WooCommerce product JSON-LD
  /"name":"([^"]+)".*?"description":"([^"]*?)".*?"image":"([^"]+)"/g,
  // Product titles
  /<h2[^>]*class="[^"]*product[^"]*"[^>]*>(.*?)<\/h2>/gi,
  // Product names
  /product_title.*?>(.*?)</gi,
  // Vietnamese product names
  /tấm pin|biến tần|pin lưu trữ|khung nhôm|tủ điện|cáp điện|tiếp địa/gi
];

console.log('\n🔍 Searching for product data...\n');

// Extract all text content to find products
const textContent = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();

// Search for product-related keywords
const productKeywords = [
  'AIKO', 'JA Solar', 'Canadian Solar', 'Huawei', 'Growatt', 'Pylontech',
  'tấm pin', 'biến tần', 'inverter', 'pin lưu trữ', 'battery',
  'Wp', 'kW', 'kWh', '550W', '580W', '800W'
];

console.log('Found product mentions:');
productKeywords.forEach(keyword => {
  const regex = new RegExp(keyword, 'gi');
  const matches = textContent.match(regex);
  if (matches) {
    console.log(`  ✓ ${keyword}: ${matches.length} times`);
  }
});

// Try to extract JSON data from script tags
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let jsonCandidates = [];

while ((match = scriptRegex.exec(html)) !== null) {
  const scriptContent = match[1];
  // Look for JSON objects with product data
  if (scriptContent.includes('name') && scriptContent.includes('price') ||
      scriptContent.includes('product') || scriptContent.includes(' WooCommerce')) {
    jsonCandidates.push(scriptContent.substring(0, 500));
  }
}

console.log(`\n📦 Found ${jsonCandidates.length} potential script tags with product data`);

if (jsonCandidates.length > 0) {
  console.log('\nFirst candidate:');
  console.log(jsonCandidates[0].substring(0, 300));
}

// Save extracted text for manual inspection
const outputFile = path.join(process.cwd(), 'scripts', 'gpg-extracted-text.txt');
fs.writeFileSync(outputFile, textContent.substring(0, 50000));
console.log(`\n✅ Extracted text saved to: ${outputFile}`);
console.log('📝 Text length:', textContent.length, 'characters');
