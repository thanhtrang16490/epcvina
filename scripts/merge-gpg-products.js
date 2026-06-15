// Merge GPG products into existing products.ts
import fs from 'fs';
import path from 'path';

const gpgProducts = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'scripts', 'gpg-products-parsed.json'), 'utf-8')
);

// Filter out the first corrupted product (contains navigation menu)
const validProducts = gpgProducts.filter(p => 
  !p.name.includes('Về chúng tôi') && 
  !p.name.includes('Giải pháp') &&
  p.name.length < 200 // Real products have short names
);

console.log(`✅ Filtered ${validProducts.length} valid products from ${gpgProducts.length} total`);

// Fix category for first product (MC4 connector should be wiring)
validProducts.forEach(p => {
  if (p.name.includes('MC4') || p.name.includes('Cáp')) {
    p.category = 'wiring';
  }
});

// Read existing products
const existingProductsFile = path.join(process.cwd(), 'astro-solar', 'src', 'data', 'products.ts');
let existingContent = fs.readFileSync(existingProductsFile, 'utf-8');

// Find the closing bracket of localProducts array
const closingBracketIndex = existingContent.lastIndexOf('];');
if (closingBracketIndex === -1) {
  console.error('❌ Cannot find closing bracket in products.ts');
  process.exit(1);
}

// Convert validProducts to TypeScript format
const newProductsCode = validProducts.map(p => {
  const specEntries = Object.entries(p.specifications || {})
    .map(([k, v]) => `      '${k}': '${v}'`)
    .join(',\n');
  
  const featuresCode = (p.features || []).map(f => `      '${f}'`).join(',\n');
  
  return `  {
    id: '${p.id}',
    name: '${p.name.replace(/'/g, "\\'")}',
    slug: '${p.slug.replace(/'/g, "\\'")}',
    brand: '${p.brand}',
    category: '${p.category}',
    model: '${p.model.replace(/'/g, "\\'")}',
    description: '${p.description.replace(/'/g, "\\'").substring(0, 200)}',
    specifications: {
${specEntries}
    },
    features: [
${featuresCode}
    ],
    warranty_years: ${p.warranty_years},
    unit_price: ${p.unit_price},
    main_image: '${p.main_image}',
    is_available: ${p.is_available},
    show_on_homepage: ${p.show_on_homepage},
    product_type: '${p.product_type}',
    ${p.phase ? `phase: '${p.phase}',` : ''}
    ${p.voltage ? `voltage: '${p.voltage}',` : ''}
  }`;
}).join(',\n');

// Insert new products before closing bracket
const beforeClosing = existingContent.substring(0, closingBracketIndex);
const afterClosing = existingContent.substring(closingBracketIndex);

const newContent = beforeClosing + ',\n\n  // Products from GPG Solar (imported)\n' + newProductsCode + '\n' + afterClosing;

// Write back
fs.writeFileSync(existingProductsFile, newContent, 'utf-8');

console.log(`✅ Added ${validProducts.length} products to products.ts`);
console.log('📊 Categories breakdown:');
const cats = {};
validProducts.forEach(p => {
  cats[p.category] = (cats[p.category] || 0) + 1;
});
Object.entries(cats).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});
