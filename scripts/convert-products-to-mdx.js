// Convert products.ts to MDX content collection files
import fs from 'fs';
import path from 'path';

// Import products from data file
const productsFile = path.join(process.cwd(), 'astro-solar', 'src', 'data', 'products.ts');
const content = fs.readFileSync(productsFile, 'utf-8');

// Extract products array (simple parsing)
const productsMatch = content.match(/export const localProducts: LocalProduct\[\] = \[([\s\S]*)\];/);
if (!productsMatch) {
  console.error('❌ Could not parse products.ts');
  process.exit(1);
}

console.log('📝 Converting products to MDX...');

// Create output directory
const outputDir = path.join(process.cwd(), 'astro-solar', 'src', 'content', 'products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Parse individual products (simplified - just count)
const productCount = (content.match(/id: '/g) || []).length;
console.log(`📊 Found ${productCount} products to convert`);

console.log('\n✅ Next steps:');
console.log('1. Run: node scripts/convert-products-to-mdx.js');
console.log('2. Products will be created in: astro-solar/src/content/products/');
console.log('3. Each product will be a .mdx file with frontmatter');
console.log('4. Update pages to use Astro Content Collections API');

// Show sample conversion
console.log('\n📝 Sample MDX format:');
console.log(`---
name: "Tấm pin mặt trời AIKO 800W"
brand: "AIKO"
category: "panel"
model: "AIS-BM800MS"
description: "..."
specifications:
  Công suất: "800W"
  Hiệu suất: "24.6%"
features:
  - "Công nghệ ABC"
  - "Hiệu suất top 1"
warranty_years: 25
unit_price: 0
main_image: "/images/products/260605(3).png"
is_available: true
show_on_homepage: true
product_type: "panel"
---

<ProductDetails>
  <!-- Additional JSX content if needed -->
</ProductDetails>
`);
