// Extract products from HTML and create markdown files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFile = path.join(__dirname, '..', 'data', 'Sản phẩm điện mặt trời _ GPG Solar.html');
const html = fs.readFileSync(htmlFile, 'utf-8');

console.log('📝 Extracting products from GPG Solar HTML...\n');

// Create output directory
const outputDir = path.join(__dirname, '..', 'astro-solar', 'src', 'content', 'products');
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

// Extract product links
const slugRegex = /san-pham\/([^"]+)-(\d+)/g;
const slugs = new Set();
let match;

while ((match = slugRegex.exec(html)) !== null) {
  slugs.add(`${match[1]}-${match[2]}`);
}

console.log(`📊 Found ${slugs.size} unique products\n`);

// Product info mapping (from crawled data)
const productInfo = {
  'dau-mc4-leader-1500v': { name: 'Đầu MC4 LEADER 1500V', brand: 'LEADER', category: 'wiring', price: 14500 },
  'cap-solar-dc-leader-6mm2-o': { name: 'Cáp Solar DC LEADER 6mm² đỏ', brand: 'LEADER', category: 'wiring', price: 25300 },
  'cap-solar-dc-leader-6mm2-en': { name: 'Cáp Solar DC LEADER 6mm² đen', brand: 'LEADER', category: 'wiring', price: 25300 },
  'cap-solar-dc-leader-4mm2-en': { name: 'Cáp Solar DC LEADER 4mm² đen', brand: 'LEADER', category: 'wiring', price: 17000 },
  'cap-solar-dc-leader-4mm2-o': { name: 'Cáp Solar DC LEADER 4mm² đỏ', brand: 'LEADER', category: 'wiring', price: 17000 },
  'tam-pin-mat-troi-aiko-800w-mat-kinh-stellar-2n-78': { name: 'Tấm pin mặt trời AIKO 800W Stellar 2N+78', brand: 'AIKO', category: 'panel', price: 0 },
  'tam-pin-mat-troi-aiko-680w-mat-kinh-stellar-2n-66': { name: 'Tấm pin mặt trời AIKO 680W Stellar 2N+66', brand: 'AIKO', category: 'panel', price: 0 },
  'tu-ien-hybrid-3-pha-15-20kw-3-string': { name: 'Tủ điện Hybrid 3 pha 15-20kW 3 String', brand: 'EPCVINA', category: 'cabinet', price: 0 },
  'tu-ien-hybrid-3-pha-12-15kw-2-string': { name: 'Tủ điện Hybrid 3 pha 12-15kW 2 String', brand: 'EPCVINA', category: 'cabinet', price: 0 },
  'tu-ien-hybrid-1-pha-8-10kw-2-string': { name: 'Tủ điện Hybrid 1 pha 8-10kW 2 String', brand: 'EPCVINA', category: 'cabinet', price: 0 },
  'tu-ien-hybrid-1-pha-6-8kw-2-string': { name: 'Tủ điện Hybrid 1 pha 6-8kW 2 String', brand: 'EPCVINA', category: 'cabinet', price: 0 },
  'pin-luu-tru-hopetrek-1608-kwh-ess-lb16-w02': { name: 'Pin lưu trữ HOPETREK 16.08kWh', brand: 'HOPETREK', category: 'lv-battery', price: 46113000 },
  'pin-luu-tru-hopetrek-512-kwh-ess-lb5-w05': { name: 'Pin lưu trữ HOPETREK 5.12kWh', brand: 'HOPETREK', category: 'lv-battery', price: 19763000 },
  'bien-tan-hybrid-hopetrek-sun-tl-hp12k-a1-3-pha': { name: 'Biến tần Hybrid HOPETREK 12kW 3 pha', brand: 'HOPETREK', category: 'hybrid-inverter', price: 42424000 },
  'bien-tan-hybrid-hopetrek-sun-tl-hp10k-a1-3-pha': { name: 'Biến tần Hybrid HOPETREK 10kW 3 pha', brand: 'HOPETREK', category: 'hybrid-inverter', price: 40579000 },
  'bien-tan-hybrid-hopetrek-sun-sl-hp6k-a1-1-pha': { name: 'Biến tần Hybrid HOPETREK 6kW 1 pha', brand: 'HOPETREK', category: 'hybrid-inverter', price: 20659000 },
  'bien-tan-hybrid-hopetrek-sun-sl-hp5k-a1-1-pha': { name: 'Biến tần Hybrid HOPETREK 5kW 1 pha', brand: 'HOPETREK', category: 'hybrid-inverter', price: 19921000 },
  'pin-luu-tru-genixgreen-1608kwh-es-box12f-max': { name: 'Pin lưu trữ GENIXGREEN 16.08kWh', brand: 'GENIXGREEN', category: 'lv-battery', price: 40017000 },
  'pin-luu-tru-genixgreen-1434kwh-es-box12f-max': { name: 'Pin lưu trữ GENIXGREEN 14.34kWh', brand: 'GENIXGREEN', category: 'lv-battery', price: 34567000 },
  'pin-luu-tru-genixgreen-1434kwh-es-box34max': { name: 'Pin lưu trữ GENIXGREEN 14.34kWh ES-BOX34MAX', brand: 'GENIXGREEN', category: 'lv-battery', price: 32695000 },
  'bien-tan-hybrid-saj-18kw-3-pha-h2-18k-lt2': { name: 'Biến tần Hybrid SAJ 18kW 3 Pha', brand: 'SAJ', category: 'hybrid-inverter', price: 54006000 },
  'bien-tan-hybrid-saj-16kw-3-pha-h2-16k-lt2': { name: 'Biến tần Hybrid SAJ 16kW 3 Pha', brand: 'SAJ', category: 'hybrid-inverter', price: 42833000 },
  'bien-tan-hybrid-saj-12kw-3-pha-h2-12k-lt2': { name: 'Biến tần Hybrid SAJ 12kW 3 Pha', brand: 'SAJ', category: 'hybrid-inverter', price: 37619000 },
  'bien-tan-hybrid-saj-12kw-1-pha-h2-12k-ls2': { name: 'Biến tần Hybrid SAJ 12kW 1 Pha', brand: 'SAJ', category: 'hybrid-inverter', price: 31287000 },
  'bien-tan-hybrid-saj-10kw-1-pha-h2-10k-ls2': { name: 'Biến tần Hybrid SAJ 10kW 1 Pha', brand: 'SAJ', category: 'hybrid-inverter', price: 29797000 },
  'bien-tan-hybrid-saj-8kw-1-pha-h2-8k-ls2': { name: 'Biến tần Hybrid SAJ 8kW 1 Pha', brand: 'SAJ', category: 'hybrid-inverter', price: 25886000 },
  'bien-tan-hybrid-saj-6kw-1-pha-h2-6k-ls2': { name: 'Biến tần Hybrid SAJ 6kW 1 Pha', brand: 'SAJ', category: 'hybrid-inverter', price: 16575000 },
  'tam-pin-mat-troi-aiko-650w-mat-kinh-stellar-2n-66': { name: 'Tấm pin mặt trời AIKO 650W Stellar', brand: 'AIKO', category: 'panel', price: 2399000 },
};

// Create markdown files
const byCategory = {};
let created = 0;

slugs.forEach(slug => {
  // Extract base slug without ID
  const parts = slug.match(/(.+)-(\d+)$/);
  if (!parts) return;
  
  const baseSlug = parts[1];
  const info = productInfo[baseSlug];
  
  if (!info) {
    console.log(`⚠️  No info for: ${baseSlug}`);
    return;
  }

  if (!byCategory[info.category]) byCategory[info.category] = [];
  byCategory[info.category].push(slug);

  const categoryDir = path.join(outputDir, info.category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  const filename = `${slug}.md`;
  const filepath = path.join(categoryDir, filename);

  const mdContent = `---
name: "${info.name}"
brand: "${info.brand}"
category: "${info.category}"
model: "${info.name.split(' ').slice(-2).join(' ')}"
description: "${info.name} - Sản phẩm chính hãng từ ${info.brand}"
${info.price > 0 ? `price: ${info.price}` : ''}
main_image: "/images/products/${baseSlug.includes('mc4') ? '260508' : baseSlug.includes('cap') ? '260508' : baseSlug.includes('aiko') ? '260605' : baseSlug.includes('tu') ? '260508' : baseSlug.includes('pin') ? '260604' : '260603'}.png"
is_available: true
---

# ${info.name}

## Mô tả
${info.name} - Sản phẩm chính hãng từ ${info.brand}, bảo hành uy tín.

## Tính năng
- Chính hãng 100%
- Bảo hành toàn quốc  
- Hỗ trợ kỹ thuật 24/7
`;

  fs.writeFileSync(filepath, mdContent, 'utf-8');
  created++;
  console.log(`✅ ${info.category}/${filename}`);
});

console.log(`\n🎉 Created ${created} product Markdown files!`);
console.log(`\n📊 Categories:`);
Object.entries(byCategory).forEach(([cat, items]) => {
  console.log(`   ${cat}: ${items.length} products`);
});
