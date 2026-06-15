// Convert GPG Solar extracted text to products.ts format
import fs from 'fs';
import path from 'path';

const extractedText = fs.readFileSync(
  path.join(process.cwd(), 'scripts', 'gpg-extracted-text.txt'),
  'utf-8'
);

// Parse products from text
// Format: Category Name (id) Price
const productRegex = /(Tấm mô-đun quang điện|Biến tần|Pin lưu trữ|Phụ kiện lắp đặt|Bán chạy)\s+([^\(]+?)\s+\((\d+)\)\s+([\d.,]+)?\s?đ?/g;

const products = [];
let match;

while ((match = productRegex.exec(extractedText)) !== null) {
  const [, category, name, id, priceStr] = match;
  
  // Clean up data
  const cleanName = name.trim();
  const price = priceStr ? parseInt(priceStr.replace(/[.,]/g, '')) : 0;
  
  // Determine product type
  let productType = 'panel';
  let phase = null;
  let voltage = null;
  let categorySlug = 'panel';
  
  if (category.includes('Biến tần')) {
    productType = 'inverter';
    categorySlug = 'hybrid-inverter';
    
    if (name.includes('1 pha')) {
      phase = '1-phase';
      voltage = 'low';
    } else if (name.includes('3 pha')) {
      phase = '3-phase';
      voltage = 'low';
    }
  } else if (category.includes('Pin lưu trữ')) {
    productType = 'inverter'; // DB constraint
    categorySlug = 'lv-battery';
    voltage = 'low';
  } else if (category.includes('Phụ kiện')) {
    if (name.includes('MC4') || name.includes('Cáp')) {
      categorySlug = 'wiring';
    } else if (name.includes('Tủ điện')) {
      categorySlug = 'cabinet';
    }
  }
  
  // Extract brand
  let brand = 'EPCVINA';
  if (name.includes('AIKO')) brand = 'AIKO';
  else if (name.includes('HOPETREK')) brand = 'HOPETREK';
  else if (name.includes('GENIXGREEN')) brand = 'GENIXGREEN';
  else if (name.includes('SAJ')) brand = 'SAJ';
  else if (name.includes('LEADER')) brand = 'LEADER';
  
  // Create slug
  const slug = cleanName
    .toLowerCase()
    .replace(/[^a-z0-9àáảãạăằắẵặặâầấẫậẩbcdđeêềếễểệfghiìíỉĩịjklmnoòóỏõọôồốỗộơờớỡợợpqrstuùúủũụưừứữựvwxyỳýỷỹỵz\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  products.push({
    id: `gpg-${id}`,
    name: cleanName,
    slug: slug,
    brand: brand,
    category: categorySlug,
    model: cleanName.split(' ').slice(-2).join(' '),
    description: `${cleanName} - Sản phẩm chính hãng, bảo hành uy tín`,
    specifications: {
      'Xuất xứ': brand,
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: category.includes('Pin') ? 10 : 5,
    unit_price: price,
    main_image: '/images/products/placeholder.jpg',
    is_available: price > 0,
    show_on_homepage: category.includes('Bán chạy'),
    product_type: productType,
    phase: phase,
    voltage: voltage,
  });
  
  console.log(`✓ ${cleanName} - ${price > 0 ? price.toLocaleString() + 'đ' : 'Liên hệ'}`);
}

console.log(`\n✅ Parsed ${products.length} products`);
console.log('\nCategories:');
const cats = {};
products.forEach(p => {
  cats[p.category] = (cats[p.category] || 0) + 1;
});
Object.entries(cats).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});

// Save to file
const outputFile = path.join(process.cwd(), 'scripts', 'gpg-products-parsed.json');
fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
console.log(`\n✅ Saved to: ${outputFile}`);
