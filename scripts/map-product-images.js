// Map product images from GPG Solar files
import fs from 'fs';
import path from 'path';

const productsFile = path.join(process.cwd(), 'astro-solar', 'src', 'data', 'products.ts');
let content = fs.readFileSync(productsFile, 'utf-8');

// Image mapping based on product names and file sizes/patterns
// Files: 260424, 260508, 260522, 260603, 260604, 260605 (various sizes)
const imageMap = {
  // AIKO panels - large images
  'AIKO 800W': '/images/products/260605(3).png',
  'AIKO 680W': '/images/products/260605(2).png',
  'AIKO 650W': '/images/products/260605(1).png',
  
  // HOPETREK inverters
  'HOPETREK SUN-TL-HP12K': '/images/products/260603.png',
  'HOPETREK SUN-TL-HP10K': '/images/products/260603(1).png',
  'HOPETREK SUN-SL-HP6K': '/images/products/260603(2).png',
  'HOPETREK SUN-SL-HP5K': '/images/products/260603(3).png',
  
  // HOPETREK batteries
  'HOPETREK 16.08': '/images/products/260604.png',
  'HOPETREK 5.12': '/images/products/260604(1).png',
  
  // GENIXGREEN batteries
  'GENIXGREEN 16.08': '/images/products/260605.png',
  'GENIXGREEN 14.34': '/images/products/260605(4).png',
  
  // SAJ inverters
  'SAJ 18kW': '/images/products/260603(4).png',
  'SAJ 16kW': '/images/products/260603(5).png',
  'SAJ 12kW 3': '/images/products/260603(5).png',
  'SAJ 12kW 1': '/images/products/260522.jpeg',
  'SAJ 10kW': '/images/products/260522.jpeg',
  'SAJ 8kW': '/images/products/260522.jpeg',
  'SAJ 6kW': '/images/products/260522.jpeg',
  
  // LEADER accessories
  'MC4': '/images/products/260508.png',
  'Cáp Solar DC LEADER 6mm2': '/images/products/260508(1).png',
  'Cáp Solar DC LEADER 4mm2': '/images/products/260508(2).png',
  
  // Tủ điện
  'Tủ điện Hybrid 3 pha 15-20kW': '/images/products/260508(3).png',
  'Tủ điện Hybrid 3 pha 12-15kW': '/images/products/260508(4).png',
  'Tủ điện Hybrid 1 pha 8-10kW': '/images/products/260508(5).png',
  'Tủ điện Hybrid 1 pha 6-8kW': '/images/products/260508(6).png',
  
  // Old products - use placeholder or generic images
  'JA Solar': '/images/products/260424.png',
  'Canadian Solar': '/images/products/260424(1).png',
  'Huawei SUN2000-5KTL': '/images/products/260508.png',
  'Huawei SUN2000-10KTL': '/images/products/260508(1).png',
  'Growatt SPH': '/images/products/260508(2).png',
  'Huawei LUNA2000': '/images/products/260604.png',
  'Pylontech US3000C': '/images/products/260604(1).png',
  'Hệ khung nhôm': '/images/products/260508(3).png',
  'Tủ điện DC': '/images/products/260508(4).png',
  'Cáp điện DC': '/images/products/260508(5).png',
  'Bộ tiếp địa': '/images/products/260508(6).png',
};

// Replace main_image in products.ts
Object.entries(imageMap).forEach(([keyword, imagePath]) => {
  // Find products containing this keyword and update their main_image
  const regex = new RegExp(`(name: '[^']*${keyword}[^']*'[\\s\\S]*?main_image: )'[^']*'`, 'g');
  
  if (regex.test(content)) {
    content = content.replace(regex, `$1'${imagePath}'`);
    console.log(`✓ Mapped: ${keyword} → ${imagePath}`);
  }
});

// Write back
fs.writeFileSync(productsFile, content, 'utf-8');

console.log('\n✅ Updated product images in products.ts');
console.log('📸 Total images mapped:', Object.keys(imageMap).length);
