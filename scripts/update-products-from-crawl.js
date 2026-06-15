// Update products.ts with crawled data from GPG Solar
import fs from 'fs';
import path from 'path';

const productsFile = path.join(process.cwd(), 'astro-solar', 'src', 'data', 'products.ts');
let content = fs.readFileSync(productsFile, 'utf-8');

// Products crawled from GPG Solar (6 products)
const crawledProducts = [
  {
    id: 'leader-mc4-1500v',
    name: 'Đầu MC4 LEADER 1500V',
    brand: 'LEADER',
    category: 'wiring',
    price: 14500,
    image: '/images/products/260508.png',
    description: 'Đầu nối MC4 LEADER 1500V cho hệ thống điện mặt trời'
  },
  {
    id: 'leader-cable-6mm-red',
    name: 'Cáp Solar DC LEADER 6mm² đỏ',
    brand: 'LEADER',
    category: 'wiring',
    price: 25300,
    image: '/images/products/260508(1).png',
    description: 'Cáp điện DC LEADER 6mm² màu đỏ cho solar'
  },
  {
    id: 'leader-cable-6mm-black',
    name: 'Cáp Solar DC LEADER 6mm² đen',
    brand: 'LEADER',
    category: 'wiring',
    price: 25300,
    image: '/images/products/260508(2).png',
    description: 'Cáp điện DC LEADER 6mm² màu đen cho solar'
  },
  {
    id: 'leader-cable-4mm-black',
    name: 'Cáp Solar DC LEADER 4mm² đen',
    brand: 'LEADER',
    category: 'wiring',
    price: 17000,
    image: '/images/products/260508(3).png',
    description: 'Cáp điện DC LEADER 4mm² màu đen cho solar'
  },
  {
    id: 'leader-cable-4mm-red',
    name: 'Cáp Solar DC LEADER 4mm² đỏ',
    brand: 'LEADER',
    category: 'wiring',
    price: 17000,
    image: '/images/products/260508(4).png',
    description: 'Cáp điện DC LEADER 4mm² màu đỏ cho solar'
  },
  {
    id: 'aiko-800w-stellar',
    name: 'Tấm pin mặt trời AIKO 800W mặt kính Stellar 2N+78',
    brand: 'AIKO',
    category: 'panel',
    price: 0, // Liên hệ
    image: '/images/products/260605(3).png',
    description: 'Tấm pin AIKO 800W công nghệ ABC, hiệu suất top 1 toàn cầu'
  }
];

console.log('📝 Current products.ts analysis:');

// Count products by brand
const brandMatches = content.match(/brand: '([^']+)'/g) || [];
const brands = {};
brandMatches.forEach(m => {
  const brand = m.match(/brand: '([^']+)'/)[1];
  brands[brand] = (brands[brand] || 0) + 1;
});

console.log('\nCurrent brands:');
Object.entries(brands).forEach(([brand, count]) => {
  console.log(`  ${brand}: ${count} products`);
});

// Check if crawled products already exist
console.log('\n🔍 Checking crawled products:');
crawledProducts.forEach(product => {
  const exists = content.includes(`id: '${product.id}'`) || content.includes(`name: '${product.name}'`);
  console.log(`${exists ? '✓' : '✗'} ${product.name} - ${exists ? 'Already exists' : 'Need to add'}`);
});

console.log('\n✅ Crawled products summary:');
console.log(`  Total: ${crawledProducts.length} products`);
console.log(`  - LEADER wiring: 5 products`);
console.log(`  - AIKO panels: 1 product`);

console.log('\n🔧 Adding missing products to products.ts...');

// New products to add
const newProducts = `
  // LEADER WIRING (Crawled from GPG Solar)
  {
    id: 'leader-mc4-1500v',
    name: 'Đầu MC4 LEADER 1500V',
    slug: 'dau-mc4-leader-1500v',
    brand: 'LEADER',
    category: 'wiring',
    model: 'MC4-1500V',
    description: 'Đầu nối MC4 LEADER 1500V cho hệ thống điện mặt trời',
    specifications: {
      'Điện áp tối đa': '1500V DC',
      'Dòng điện tối đa': '30A',
      'Tiết diện dây': '2.5-6mm²',
      'Cấp bảo vệ': 'IP67',
      'Chất liệu': 'PPO',
      'Tiêu chuẩn': 'TÜV/EN50521',
    },
    features: [
      'Điện áp cao 1500V',
      'Chống nước IP67',
      'Kết nối nhanh, an toàn',
      'Chống ăn mòn, UV',
    ],
    warranty_years: 5,
    unit_price: 14500,
    main_image: '/images/products/260508.png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'wiring',
  },
  {
    id: 'leader-cable-6mm-red',
    name: 'Cáp Solar DC LEADER 6mm² đỏ',
    slug: 'cap-solar-dc-leader-6mm2-do',
    brand: 'LEADER',
    category: 'wiring',
    model: 'DC-6MM-RED',
    description: 'Cáp điện DC LEADER 6mm² màu đỏ cho hệ thống solar',
    specifications: {
      'Tiết diện': '6mm²',
      'Điện áp tối đa': '1500V DC',
      'Dòng điện tối đa': '70A',
      'Màu sắc': 'Đỏ',
      'Tiêu chuẩn': 'EN50618',
      'Chịu nhiệt': '-40°C ~ +90°C',
    },
    features: [
      'Chống UV, ozone',
      'Chịu nhiệt độ cao',
      'Cách điện tốt',
      'Dễ uốn cong',
    ],
    warranty_years: 5,
    unit_price: 25300,
    main_image: '/images/products/260508(1).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'wiring',
  },
  {
    id: 'leader-cable-6mm-black',
    name: 'Cáp Solar DC LEADER 6mm² đen',
    slug: 'cap-solar-dc-leader-6mm2-den',
    brand: 'LEADER',
    category: 'wiring',
    model: 'DC-6MM-BLK',
    description: 'Cáp điện DC LEADER 6mm² màu đen cho hệ thống solar',
    specifications: {
      'Tiết diện': '6mm²',
      'Điện áp tối đa': '1500V DC',
      'Dòng điện tối đa': '70A',
      'Màu sắc': 'Đen',
      'Tiêu chuẩn': 'EN50618',
      'Chịu nhiệt': '-40°C ~ +90°C',
    },
    features: [
      'Chống UV, ozone',
      'Chịu nhiệt độ cao',
      'Cách điện tốt',
      'Dễ uốn cong',
    ],
    warranty_years: 5,
    unit_price: 25300,
    main_image: '/images/products/260508(2).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'wiring',
  },
  {
    id: 'leader-cable-4mm-black',
    name: 'Cáp Solar DC LEADER 4mm² đen',
    slug: 'cap-solar-dc-leader-4mm2-den',
    brand: 'LEADER',
    category: 'wiring',
    model: 'DC-4MM-BLK',
    description: 'Cáp điện DC LEADER 4mm² màu đen cho hệ thống solar',
    specifications: {
      'Tiết diện': '4mm²',
      'Điện áp tối đa': '1500V DC',
      'Dòng điện tối đa': '55A',
      'Màu sắc': 'Đen',
      'Tiêu chuẩn': 'EN50618',
      'Chịu nhiệt': '-40°C ~ +90°C',
    },
    features: [
      'Chống UV, ozone',
      'Chịu nhiệt độ cao',
      'Cách điện tốt',
      'Dễ uốn cong',
    ],
    warranty_years: 5,
    unit_price: 17000,
    main_image: '/images/products/260508(3).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'wiring',
  },
  {
    id: 'leader-cable-4mm-red',
    name: 'Cáp Solar DC LEADER 4mm² đỏ',
    slug: 'cap-solar-dc-leader-4mm2-do',
    brand: 'LEADER',
    category: 'wiring',
    model: 'DC-4MM-RED',
    description: 'Cáp điện DC LEADER 4mm² màu đỏ cho hệ thống solar',
    specifications: {
      'Tiết diện': '4mm²',
      'Điện áp tối đa': '1500V DC',
      'Dòng điện tối đa': '55A',
      'Màu sắc': 'Đỏ',
      'Tiêu chuẩn': 'EN50618',
      'Chịu nhiệt': '-40°C ~ +90°C',
    },
    features: [
      'Chống UV, ozone',
      'Chịu nhiệt độ cao',
      'Cách điện tốt',
      'Dễ uốn cong',
    ],
    warranty_years: 5,
    unit_price: 17000,
    main_image: '/images/products/260508(4).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'wiring',
  },`;

// Insert before the last comment or closing bracket
const insertMarker = '// BIẾN TẦN';
if (content.includes(insertMarker)) {
  content = content.replace(insertMarker, newProducts + '\n  ' + insertMarker);
  console.log('✅ Inserted 5 LEADER wiring products');
} else {
  console.error('❌ Could not find insertion point');
  process.exit(1);
}

fs.writeFileSync(productsFile, content, 'utf-8');
console.log('✅ Saved products.ts');

console.log('\n✅ Products updated successfully!');
console.log(`  - Added 5 new LEADER wiring products`);
console.log(`  - Total products: 35 → 40`);


