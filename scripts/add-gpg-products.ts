/**
 * Script to add GPG Solar products to Supabase
 * Run with: npx tsx scripts/add-gpg-products.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../astro-solar/.env') });

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GPG Solar products data (from https://gpgsolar.vn/san-pham)
const gpgProducts = [
  // TẤM QUANG NĂNG (Solar Panels)
  {
    name: 'Tấm pin JA Solar JAM72D40 550W',
    brand_slug: 'ja-solar',
    category_slug: 'panel',
    model: 'JAM72D40-550W',
    description: 'Tấm pin năng lượng mặt trời JA Solar 550W, hiệu suất cao, công nghệ Half-cell PERC',
    specifications: {
      'Công suất': '550W',
      'Hiệu suất': '21.05%',
      'Loại cell': 'Mono PERC Half-cell',
      'Số lượng cell': '144 cells',
      'Điện áp Vmp': '41.8V',
      'Dòng điện Imp': '13.17A',
      'Kích thước': '2278x1134x35mm',
      'Trọng lượng': '28.6kg',
      'Bảo hành': '15 năm',
      'Bảo hành hiệu suất': '25 năm',
    },
    features: [
      'Công nghệ Half-cell PERC tăng hiệu suất',
      'Chịu tải gió và tuyết tốt',
      'ChốngPID',
      'Hiệu suất module cao đến 21.05%',
    ],
    warranty_years: 15,
    unit_price: 2850000,
    product_type: 'panel',
    phase: null,
    voltage: null,
    main_image: 'https://gpgsolar.vn/wp-content/uploads/2023/06/ja-solar-550w.jpg',
    is_available: true,
    show_on_homepage: true,
  },
  {
    name: 'Tấm pin Canadian Solar HiKu7 580W',
    brand_slug: 'canadian-solar',
    category_slug: 'panel',
    model: 'CS7L-580MS',
    description: 'Tấm pin Canadian Solar 580W, công nghệ TOPCon, hiệu suất cao',
    specifications: {
      'Công suất': '580W',
      'Hiệu suất': '22.3%',
      'Loại cell': 'Mono TOPCon',
      'Số lượng cell': '132 cells',
      'Điện áp Vmp': '43.3V',
      'Dòng điện Imp': '13.41A',
      'Kích thước': '2278x1134x35mm',
      'Trọng lượng': '28.5kg',
      'Bảo hành': '15 năm',
      'Bảo hành hiệu suất': '30 năm',
    },
    features: [
      'Công nghệ TOPCon tiên tiến',
      'Hiệu suất module lên đến 22.3%',
      'Hệ số nhiệt độ thấp',
      'ChốngPID tiềm ẩn',
    ],
    warranty_years: 15,
    unit_price: 3200000,
    product_type: 'panel',
    phase: null,
    voltage: null,
    main_image: 'https://gpgsolar.vn/wp-content/uploads/2023/06/canadian-solar-580w.jpg',
    is_available: true,
    show_on_homepage: true,
  },

  // BIẾN TẦN (Inverters)
  {
    name: 'Biến tần Huawei SUN2000-5KTL-L1',
    brand_slug: 'huawei',
    category_slug: 'hybrid-inverter',
    model: 'SUN2000-5KTL-L1',
    description: 'Biến tần Huawei 5kW 1 pha, tích hợp WLAN, giám sát từ xa',
    specifications: {
      'Công suất định mức': '5000W',
      'Loại': 'Hybrid 1 pha',
      'Điện áp DC tối đa': '600V',
      'MPPT': '2 MPPT',
      'Hiệu suất': '97.8%',
      'Kích thước': '461x385x162mm',
      'Trọng lượng': '12.5kg',
      'Bảo hành': '5 năm',
      'Màn hình': 'LED + WLAN',
    },
    features: [
      'Tích hợp AI, tối ưu hóa sản xuất điện',
      'Chống nhiễu DC/AFCI',
      'Giám sát từ xa qua FusionSolar',
      'Thiết kế không quạt, vận hành êm',
    ],
    warranty_years: 5,
    unit_price: 12500000,
    product_type: 'inverter',
    phase: '1-phase',
    voltage: '220V',
    main_image: 'https://gpgsolar.vn/wp-content/uploads/2023/06/huawei-5ktl-l1.jpg',
    is_available: true,
    show_on_homepage: true,
  },
  {
    name: 'Biến tần Huawei SUN2000-10KTL-M1',
    brand_slug: 'huawei',
    category_slug: 'on-grid-3phase-lv',
    model: 'SUN2000-10KTL-M1',
    description: 'Biến tần Huawei 10kW 3 pha, hiệu suất cao, thông minh',
    specifications: {
      'Công suất định mức': '10000W',
      'Loại': 'On-grid 3 pha',
      'Điện áp DC tối đa': '1100V',
      'MPPT': '4 MPPT',
      'Hiệu suất': '98.4%',
      'Kích thước': '370x585x255mm',
      'Trọng lượng': '20kg',
      'Bảo hành': '5 năm',
      'Màn hình': 'LED + WiFi',
    },
    features: [
      '4 MPPT độc lập',
      'Quản lý thông minh qua FusionSolar',
      'AFCI chống hồ quang',
      'Hiệu suất tối đa 98.4%',
    ],
    warranty_years: 5,
    unit_price: 18500000,
    product_type: 'inverter',
    phase: '3-phase',
    voltage: '380V',
    main_image: 'https://gpgsolar.vn/wp-content/uploads/2023/06/huawei-10ktl-m1.jpg',
    is_available: true,
    show_on_homepage: true,
  },
  {
    name: 'Biến tần Growatt SPH 5000 TL BH-UP',
    brand_slug: 'growatt',
    category_slug: 'hybrid-inverter',
    model: 'SPH5000 TL BH-UP',
    description: 'Biến tần Growatt Hybrid 5kW 1 pha, tích hợp lưu trữ',
    specifications: {
      'Công suất định mức': '5000W',
      'Loại': 'Hybrid 1 pha',
      'Điện áp DC tối đa': '600V',
      'MPPT': '2 MPPT',
      'Hiệu suất': '97.6%',
      'Kích thước': '420x380x180mm',
      'Trọng lượng': '14kg',
      'Bảo hành': '5 năm',
      'Pin lưu trữ': 'Hỗ trợ pin lithium',
    },
    features: [
      'Hỗ trợ hybrid với pin lưu trữ',
      'UPS switching <10ms',
      'Giám sát qua WiFi/LAN',
      'Thiết kế nhỏ gọn',
    ],
    warranty_years: 5,
    unit_price: 11200000,
    product_type: 'inverter',
    phase: '1-phase',
    voltage: '220V',
    main_image: 'https://gpgsolar.vn/wp-content/uploads/2023/06/growatt-sph-5000.jpg',
    is_available: true,
    show_on_homepage: true,
  },

  // PIN LƯU TRỮ (Batteries)
  {
    name: 'Pin lithium Huawei LUNA2000-5-S0',
    brand_slug: 'huawei',
    category_slug: 'lv-battery',
    model: 'LUNA2000-5-S0',
    description: 'Pin lưu trữ Huawei LUNA2000 5kWh, modular, dễ mở rộng',
    specifications: {
      'Dung lượng': '5kWh',
      'Loại pin': 'Lithium-ion LFP',
      'Điện áp': '200-600V',
      'Dòng sạc/xả tối đa': '25A',
      'Hiệu suất': '97%',
      'Kích thước': '400x135x560mm',
      'Trọng lượng': '52kg',
      'Bảo hành': '10 năm',
      'Chu kỳ sạc': '>6000 cycles',
    },
    features: [
      'Thiết kế modular, dễ mở rộng',
      'Tích hợp hoàn hảo với Huawei inverter',
      'An toàn cao với LFP',
      'Quản lý thông minh qua EMS',
    ],
    warranty_years: 10,
    unit_price: 32000000,
    product_type: 'panel',
    phase: null,
    voltage: '200-600V',
    main_image: 'https://gpgsolar.vn/wp-content/uploads/2023/06/huawei-luna2000-5.jpg',
    is_available: true,
    show_on_homepage: true,
  },
  {
    name: 'Pin lithium Pylontech US3000C',
    brand_slug: 'pylontech',
    category_slug: 'lv-battery',
    model: 'US3000C',
    description: 'Pin lưu trữ Pylontech 3.5kWh, tương thích nhiều loại inverter',
    specifications: {
      'Dung lượng': '3.5kWh',
      'Loại pin': 'Lithium-ion LFP',
      'Điện áp': '48V (44.8-54V)',
      'Dòng sạc/xả tối đa': '37.5A',
      'Hiệu suất': '95%',
      'Kích thước': '445x600x135mm',
      'Trọng lượng': '33kg',
      'Bảo hành': '5 năm',
      'Chu kỳ sạc': '>6000 cycles @ 95% DOD',
    },
    features: [
      'Tương thích rộng với nhiều inverter',
      'Thiết kế rack-mount',
      'Mở rộng đến 16 module',
      'BMS tích hợp thông minh',
    ],
    warranty_years: 5,
    unit_price: 18500000,
    product_type: 'panel',
    phase: null,
    voltage: '48V',
    main_image: 'https://gpgsolar.vn/wp-content/uploads/2023/06/pylontech-us3000c.jpg',
    is_available: true,
    show_on_homepage: true,
  },

  // HỆ KHUNG NHÔM (Mounting Systems)
  {
    name: 'Hệ khung nhôm mái tôn 5kW',
    brand_slug: 'gpg-solar',
    category_slug: 'mounting',
    model: 'GPG-MOUNT-ROOF-5KW',
    description: 'Hệ khung nhôm cho mái tôn, công suất 5kW, vật liệu cao cấp',
    specifications: {
      'Loại mái': 'Mái tôn',
      'Công suất': '5kW',
      'Vật liệu': 'Nhôm AL6005-T5',
      'Số tấm': '10 tấm',
      'Góc nghiêng': '10-15 độ',
      'Tải trọng gió': '50m/s',
      'Bảo hành': '10 năm',
      'Tuổi thọ': '>20 năm',
    },
    features: [
      'Nhôm cao cấp chống ăn mòn',
      'Lắp đặt nhanh, dễ dàng',
      'Phụ kiện đầy đủ',
      'Tương thích mọi loại tấm pin',
    ],
    warranty_years: 10,
    unit_price: 8500000,
    main_image: 'https://gpgsolar.vn/wp-content/uploads/2023/06/mounting-roof-5kw.jpg',
    is_available: true,
    show_on_homepage: false,
  },

  // TỦ ĐIỆN (Cabinets)
  {
    name: 'Tủ điện DC Solar 10 string',
    brand_slug: 'gpg-solar',
    category_slug: 'cabinet',
    model: 'GPG-DC-10S',
    description: 'Tủ điện DC cho hệ thống solar 10 string, bảo vệ toàn diện',
    specifications: {
      'Số string': '10',
      'Dòng điện tối đa': '20A/string',
      'Điện áp DC tối đa': '1000V',
      'Cấp bảo vệ': 'IP65',
      'Vật liệu': 'Thép sơn tĩnh điện',
      'Kích thước': '600x800x250mm',
      'Bảo hành': '5 năm',
    },
    features: [
      'Bảo vệ quá dòng, quá áp',
      'Chống sét lan truyền',
      'IP65 chống nước, bụi',
      'Dễ lắp đặt và bảo trì',
    ],
    warranty_years: 5,
    unit_price: 4500000,
    main_image: 'https://gpgsolar.vn/wp-content/uploads/2023/06/dc-cabinet-10s.jpg',
    is_available: true,
    show_on_homepage: false,
  },

  // HỆ DÂY ĐIỆN (Wiring)
  {
    name: 'Cáp điện DC solar 4mm² (100m)',
    brand_slug: 'gpg-solar',
    category_slug: 'wiring',
    model: 'GPG-DC-4MM-100M',
    description: 'Cáp điện DC chuyên dụng cho solar 4mm², cuộn 100m',
    specifications: {
      'Tiết diện': '4mm²',
      'Chiều dài': '100m',
      'Điện áp định mức': 'DC 1500V',
      'Dòng điện tối đa': '55A',
      'Nhiệt độ hoạt động': '-40°C đến +120°C',
      'Vỏ bọc': 'XLPE chống UV',
      'Tiêu chuẩn': 'TUV EN50618',
      'Bảo hành': '5 năm',
    },
    features: [
      'Chống UV, chống thời tiết',
      'Chịu nhiệt độ cao',
      'An toàn cho hệ DC',
      'Dễ uốn, lắp đặt',
    ],
    warranty_years: 5,
    unit_price: 1850000,
    main_image: 'https://gpgsolar.vn/wp-content/uploads/2023/06/dc-cable-4mm.jpg',
    is_available: true,
    show_on_homepage: false,
  },

  // HỆ TIẾP ĐỊA (Grounding)
  {
    name: 'Bộ tiếp địa cho hệ solar',
    brand_slug: 'gpg-solar',
    category_slug: 'grounding',
    model: 'GPG-GROUND-KIT',
    description: 'Bộ tiếp địa hoàn chỉnh cho hệ thống điện mặt trời',
    specifications: {
      'Số cọc': '3 cọc',
      'Vật liệu': 'Đồng mạ thép',
      'Chiều dài cọc': '2.4m',
      'Điện trở tiếp địa': '<10Ω',
      'Dây đồng': '16mm²',
      'Bảo hành': '10 năm',
    },
    features: [
      'An toàn chống giật',
      'Chống sét lan truyền',
      'Đồng mạ thép bền bỉ',
      'Dễ lắp đặt',
    ],
    warranty_years: 10,
    unit_price: 2500000,
    main_image: 'https://gpgsolar.vn/wp-content/uploads/2023/06/grounding-kit.jpg',
    is_available: true,
    show_on_homepage: false,
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function addGPGProducts() {
  console.log('🔍 Fetching categories and brands...');

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug');

  const categoryMap = new Map(categories?.map((c: any) => [c.slug, c.id]));

  // Fetch or create GPG Solar brand
  let gpgBrandId: number;
  const { data: gpgBrand } = await supabase
    .from('brands')
    .select('id')
    .eq('slug', 'gpg-solar')
    .single();

  if (gpgBrand) {
    gpgBrandId = gpgBrand.id;
    console.log('✓ GPG Solar brand exists');
  } else {
    const { data: newBrand, error } = await supabase
      .from('brands')
      .insert([{
        name: 'GPG Solar',
        slug: 'gpg-solar',
        description: 'Nhà cung cấp thiết bị điện mặt trời hàng đầu Việt Nam',
        logo_url: 'https://gpgsolar.vn/wp-content/uploads/2023/06/gpg-solar-logo.png',
        website: 'https://gpgsolar.vn',
      }])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating GPG Solar brand:', error);
      return;
    }
    gpgBrandId = newBrand.id;
    console.log('✓ Created GPG Solar brand');
  }

  console.log('\n📦 Adding products...');

  for (const product of gpgProducts) {
    const categoryId = categoryMap.get(product.category_slug);
    if (!categoryId) {
      console.log(`⚠️  Category ${product.category_slug} not found, skipping ${product.name}`);
      continue;
    }

    // Get brand_id
    let brandId = gpgBrandId;
    if (product.brand_slug !== 'gpg-solar') {
      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', product.brand_slug)
        .single();
      
      if (brand) {
        brandId = brand.id;
      } else {
        console.log(`⚠️  Brand ${product.brand_slug} not found, using GPG Solar`);
      }
    }

    // Check if product already exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('name', product.name)
      .single();

    if (existing) {
      console.log(`⏭️  ${product.name} already exists`);
      continue;
    }

    // Insert product
    const slug = slugify(product.name);
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        slug: slug,
        brand_id: brandId,
        category_id: categoryId,
        model: product.model,
        description: product.description,
        specifications: product.specifications,
        features: product.features,
        warranty_years: product.warranty_years,
        unit_price: product.unit_price,
        product_type: product.product_type,
        phase: product.phase || null,
        voltage: product.voltage || null,
        main_image: product.main_image,
        is_available: product.is_available,
        show_on_homepage: product.show_on_homepage,
      }])
      .select('id')
      .single();

    if (error) {
      console.error(`❌ Error adding ${product.name}:`, error);
    } else {
      console.log(`✅ Added: ${product.name}`);
    }
  }

  console.log('\n✨ Done!');
}

addGPGProducts().catch(console.error);
