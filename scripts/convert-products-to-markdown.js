// Convert products.ts to Markdown content collection files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import products
const productsFile = path.join(__dirname, '..', 'astro-solar', 'src', 'data', 'products.ts');
const content = fs.readFileSync(productsFile, 'utf-8');

// Extract localProducts array
const match = content.match(/export const localProducts: LocalProduct\[\] = \[([\s\S]*)\n\];/);
if (!match) {
  console.error('❌ Could not parse products.ts');
  process.exit(1);
}

console.log('📝 Converting products to Markdown...');

// Create output directory
const outputDir = path.join(__dirname, '..', 'astro-solar', 'src', 'content', 'products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
} else {
  // Clear existing files
  fs.readdirSync(outputDir).forEach(file => {
    fs.unlinkSync(path.join(outputDir, file));
  });
}

// Parse products using eval (safe since it's our own file)
const productsCode = `const localProducts = [${match[1]}];\nlocalProducts`;
const localProducts = eval(productsCode);

console.log(`📊 Found ${localProducts.length} products to convert\n`);

// Group by category
const byCategory = {};
localProducts.forEach(product => {
  const cat = product.category || 'other';
  if (!byCategory[cat]) byCategory[cat] = [];
  byCategory[cat].push(product);
});

// Create markdown files
let totalCreated = 0;
Object.entries(byCategory).forEach(([category, products]) => {
  const categoryDir = path.join(outputDir, category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  products.forEach((product, index) => {
    const slug = product.slug || `${category}-${index}`;
    const filename = `${slug}.md`;
    const filepath = path.join(categoryDir, filename);

    // Convert specifications to YAML format
    const specsYaml = product.specifications 
      ? Object.entries(product.specifications)
          .map(([key, value]) => `    ${key}: "${value}"`)
          .join('\n')
      : '';

    // Convert features to YAML list
    const featuresYaml = product.features
      ? product.features.map(f => `  - "${f}"`).join('\n')
      : '';

    const mdContent = `---
name: "${product.name}"
brand: "${product.brand}"
category: "${product.category}"
model: "${product.model}"
description: "${product.description}"
${product.unit_price ? `price: ${product.unit_price}` : ''}
${specsYaml ? `specifications:\n${specsYaml}` : ''}
${featuresYaml ? `features:\n${featuresYaml}` : ''}
${product.warranty_years ? `warranty: "${product.warranty_years} năm"` : ''}
main_image: "${product.main_image}"
is_available: ${product.is_available}
---

<!-- Product content goes here -->
`;

    fs.writeFileSync(filepath, mdContent, 'utf-8');
    totalCreated++;
    console.log(`✅ ${category}/${filename}`);
  });
});

console.log(`\n🎉 Successfully created ${totalCreated} product files!`);
console.log(`📁 Output directory: ${outputDir}`);
console.log(`\n📊 Category breakdown:`);
Object.entries(byCategory).forEach(([cat, products]) => {
  console.log(`   - ${cat}: ${products.length} products`);
});
