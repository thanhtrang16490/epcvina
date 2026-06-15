// Local product catalog - EPCVINA products
export interface LocalProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  model: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  warranty_years: number;
  unit_price: number;
  main_image: string;
  is_available: boolean;
  show_on_homepage: boolean;
  product_type: 'panel' | 'inverter';
  phase?: '1-phase' | '3-phase' | null;
  voltage?: 'low' | 'high' | null;
}

export const localProducts: LocalProduct[] = [
  // TẤM QUANG NĂNG (Solar Panels) - AIKO only
  
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
  },
  // BIẾN TẦN (Inverters)
  {
    id: 'huawei-5ktl-l1',
    name: 'Biến tần Huawei SUN2000-5KTL-L1',
    slug: 'bien-tan-huawei-sun2000-5ktl-l1',
    brand: 'Huawei',
    category: 'hybrid-inverter',
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
    main_image: '/images/products/260508.png',
    is_available: true,
    show_on_homepage: true,
    product_type: 'inverter',
    phase: '1-phase',
    voltage: 'low',
  },
  {
    id: 'huawei-10ktl-m1',
    name: 'Biến tần Huawei SUN2000-10KTL-M1',
    slug: 'bien-tan-huawei-sun2000-10ktl-m1',
    brand: 'Huawei',
    category: 'on-grid-3phase-lv',
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
    main_image: '/images/products/260508(1).png',
    is_available: true,
    show_on_homepage: true,
    product_type: 'inverter',
    phase: '3-phase',
    voltage: 'low',
  },
  {
    id: 'growatt-sph-5000',
    name: 'Biến tần Growatt SPH 5000 TL BH-UP',
    slug: 'bien-tan-growatt-sph-5000-tl-bh-up',
    brand: 'Growatt',
    category: 'hybrid-inverter',
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
    main_image: '/images/products/260508(2).png',
    is_available: true,
    show_on_homepage: true,
    product_type: 'inverter',
    phase: '1-phase',
    voltage: 'low',
  },

  // PIN LƯU TRỮ (Batteries) - dùng product_type 'inverter' vì DB constraint
  {
    id: 'huawei-luna2000-5',
    name: 'Pin lithium Huawei LUNA2000-5-S0',
    slug: 'pin-lithium-huawei-luna2000-5-s0',
    brand: 'Huawei',
    category: 'lv-battery',
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
    main_image: '/images/products/260604.png',
    is_available: true,
    show_on_homepage: true,
    product_type: 'inverter',
    voltage: 'high',
  },
  {
    id: 'pylontech-us3000c',
    name: 'Pin lithium Pylontech US3000C',
    slug: 'pin-lithium-pylontech-us3000c',
    brand: 'Pylontech',
    category: 'lv-battery',
    model: 'US3000C',
    description: 'Pin lưu trữ Pylontech 3.5kWh, tương thích nhiều loại inverter',
    specifications: {
      'Dung lượng': '3.5kWh',
      'Loại pin': 'Lithium-ion LFP',
      'Điện áp': '48V',
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
    main_image: '/images/products/260604(1).png',
    is_available: true,
    show_on_homepage: true,
    product_type: 'inverter',
    voltage: 'low',
  },

  // HỆ KHUNG NHÔM (Mounting Systems)
  {
    id: 'gpg-mount-roof-5kw',
    name: 'Hệ khung nhôm mái tôn 5kW EPCVINA',
    slug: 'he-khung-nhom-mai-ton-5kw-epcvina',
    brand: 'EPCVINA',
    category: 'mounting',
    model: 'EPC-MOUNT-ROOF-5KW',
    description: 'Hệ khung nhôm EPCVINA cho mái tôn, công suất 5kW, vật liệu cao cấp',
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
    main_image: '/images/products/260508(3).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'panel',
  },

  // TỦ ĐIỆN (Cabinets)
  {
    id: 'gpg-dc-10s',
    name: 'Tủ điện DC Solar EPCVINA 10 string',
    slug: 'tu-dien-dc-solar-epcvina-10-string',
    brand: 'EPCVINA',
    category: 'cabinet',
    model: 'EPC-DC-10S',
    description: 'Tủ điện DC EPCVINA cho hệ thống solar 10 string, bảo vệ toàn diện',
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
    main_image: '/images/products/260508(4).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
  },

  // HỆ DÂY ĐIỆN (Wiring)
  {
    id: 'gpg-dc-4mm-100m',
    name: 'Cáp điện DC solar EPCVINA 4mm² (100m)',
    slug: 'cap-dien-dc-solar-epcvina-4mm-100m',
    brand: 'EPCVINA',
    category: 'wiring',
    model: 'EPC-DC-4MM-100M',
    description: 'Cáp điện DC EPCVINA chuyên dụng cho solar 4mm², cuộn 100m',
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
    main_image: '/images/products/260508(5).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
  },

  // HỆ TIẾP ĐỊA (Grounding)
  {
    id: 'gpg-ground-kit',
    name: 'Bộ tiếp địa EPCVINA cho hệ solar',
    slug: 'bo-tiep-dia-epcvina-cho-he-solar',
    brand: 'EPCVINA',
    category: 'grounding',
    model: 'EPC-GROUND-KIT',
    description: 'Bộ tiếp địa EPCVINA hoàn chỉnh cho hệ thống điện mặt trời',
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
    main_image: '/images/products/260508(6).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
  },
];

// Helper functions
export function getProductsByCategory(category: string): LocalProduct[] {
  if (!category || category === 'all') return localProducts;
  return localProducts.filter(p => p.category === category);
}

export function getProductsByBrand(brand: string): LocalProduct[] {
  if (!brand) return localProducts;
  return localProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
}

export function searchProducts(query: string): LocalProduct[] {
  if (!query) return localProducts;
  const q = query.toLowerCase();
  return localProducts.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.model.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
}

export function getProductById(id: string): LocalProduct | undefined {
  return localProducts.find(p => p.id === id);
}

export function getBrands(): string[] {
  const brands = new Set(localProducts.map(p => p.brand));
  return Array.from(brands).sort();
}

export function filterProducts(filters: {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  productType?: string;
  phase?: string;
  voltage?: string;
}): LocalProduct[] {
  let filtered = [...localProducts,

  // Products from GPG Solar (imported)
  {
    id: 'gpg-90',
    name: 'Cáp Solar DC LEADER 6mm2 đỏ',
    slug: 'cáp-solar-dc-leader-6mm2-đỏ',
    brand: 'LEADER',
    category: 'wiring',
    model: '6mm2 đỏ',
    description: 'Cáp Solar DC LEADER 6mm2 đỏ - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'LEADER',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 25300,
    main_image: '/images/products/260508(1).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'panel',
    
    
  },
  {
    id: 'gpg-82',
    name: 'Cáp Solar DC LEADER 6mm2 đen',
    slug: 'cáp-solar-dc-leader-6mm2-đen',
    brand: 'LEADER',
    category: 'wiring',
    model: '6mm2 đen',
    description: 'Cáp Solar DC LEADER 6mm2 đen - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'LEADER',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 25300,
    main_image: '/images/products/260508(1).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'panel',
    
    
  },
  {
    id: 'gpg-22',
    name: 'Cáp Solar DC LEADER 4mm2 đen',
    slug: 'cáp-solar-dc-leader-4mm2-đen',
    brand: 'LEADER',
    category: 'wiring',
    model: '4mm2 đen',
    description: 'Cáp Solar DC LEADER 4mm2 đen - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'LEADER',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 17000,
    main_image: '/images/products/260508(2).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'panel',
    
    
  },
  {
    id: 'gpg-27',
    name: 'Cáp Solar DC LEADER 4mm2 đỏ',
    slug: 'cáp-solar-dc-leader-4mm2-đỏ',
    brand: 'LEADER',
    category: 'wiring',
    model: '4mm2 đỏ',
    description: 'Cáp Solar DC LEADER 4mm2 đỏ - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'LEADER',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 17000,
    main_image: '/images/products/260508(2).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'panel',
    
    
  },
  {
    id: 'gpg-39',
    name: 'Tấm pin mặt trời AIKO 800W mặt kính Stellar 2N+78',
    slug: 'tấm-pin-mặt-trời-aiko-800w-mặt-kính-stellar-2n78',
    brand: 'AIKO',
    category: 'panel',
    model: 'Stellar 2N+78',
    description: 'Tấm pin mặt trời AIKO 800W mặt kính Stellar 2N+78 - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'AIKO',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 0,
    main_image: '/images/products/260605(3).png',
    is_available: false,
    show_on_homepage: false,
    product_type: 'panel',
    
    
  },
  {
    id: 'gpg-60',
    name: 'Tấm pin mặt trời AIKO 680W mặt kính Stellar 2N+66',
    slug: 'tấm-pin-mặt-trời-aiko-680w-mặt-kính-stellar-2n66',
    brand: 'AIKO',
    category: 'panel',
    model: 'Stellar 2N+66',
    description: 'Tấm pin mặt trời AIKO 680W mặt kính Stellar 2N+66 - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'AIKO',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 0,
    main_image: '/images/products/260605(2).png',
    is_available: false,
    show_on_homepage: false,
    product_type: 'panel',
    
    
  },
  {
    id: 'gpg-96',
    name: 'Tủ điện Hybrid 3 pha 15-20kW 3 String',
    slug: 'tủ-điện-hybrid-3-pha-15-20kw-3-string',
    brand: 'EPCVINA',
    category: 'cabinet',
    model: '3 String',
    description: 'Tủ điện Hybrid 3 pha 15-20kW 3 String - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'EPCVINA',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 0,
    main_image: '/images/products/260508(3).png',
    is_available: false,
    show_on_homepage: false,
    product_type: 'panel',
    
    
  },
  {
    id: 'gpg-29',
    name: 'Tủ điện Hybrid 3 pha 12-15kW 2 String',
    slug: 'tủ-điện-hybrid-3-pha-12-15kw-2-string',
    brand: 'EPCVINA',
    category: 'cabinet',
    model: '2 String',
    description: 'Tủ điện Hybrid 3 pha 12-15kW 2 String - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'EPCVINA',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 0,
    main_image: '/images/products/260508(4).png',
    is_available: false,
    show_on_homepage: false,
    product_type: 'panel',
    
    
  },
  {
    id: 'gpg-9',
    name: 'Tủ điện Hybrid 1 pha 8-10kW 2 String',
    slug: 'tủ-điện-hybrid-1-pha-8-10kw-2-string',
    brand: 'EPCVINA',
    category: 'cabinet',
    model: '2 String',
    description: 'Tủ điện Hybrid 1 pha 8-10kW 2 String - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'EPCVINA',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 0,
    main_image: '/images/products/260508(5).png',
    is_available: false,
    show_on_homepage: false,
    product_type: 'panel',
    
    
  },
  {
    id: 'gpg-45',
    name: 'Tủ điện Hybrid 1 pha 6-8kW 2 String',
    slug: 'tủ-điện-hybrid-1-pha-6-8kw-2-string',
    brand: 'EPCVINA',
    category: 'cabinet',
    model: '2 String',
    description: 'Tủ điện Hybrid 1 pha 6-8kW 2 String - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'EPCVINA',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 0,
    main_image: '/images/products/260508(6).png',
    is_available: false,
    show_on_homepage: false,
    product_type: 'panel',
    
    
  },
  {
    id: 'gpg-34',
    name: 'Pin lưu trữ HOPETREK 16.08 kWh ESS-LB16-W02',
    slug: 'pin-lưu-trữ-hopetrek-1608-kwh-ess-lb16-w02',
    brand: 'HOPETREK',
    category: 'lv-battery',
    model: 'kWh ESS-LB16-W02',
    description: 'Pin lưu trữ HOPETREK 16.08 kWh ESS-LB16-W02 - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'HOPETREK',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 10,
    unit_price: 46113000,
    main_image: '/images/products/260604.png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    
    voltage: 'low',
  },
  {
    id: 'gpg-81',
    name: 'Pin lưu trữ HOPETREK 5.12 KWh ESS-LB5-W05',
    slug: 'pin-lưu-trữ-hopetrek-512-kwh-ess-lb5-w05',
    brand: 'HOPETREK',
    category: 'lv-battery',
    model: 'KWh ESS-LB5-W05',
    description: 'Pin lưu trữ HOPETREK 5.12 KWh ESS-LB5-W05 - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'HOPETREK',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 10,
    unit_price: 19763000,
    main_image: '/images/products/260604(1).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    
    voltage: 'low',
  },
  {
    id: 'gpg-98',
    name: 'Biến tần Hybrid HOPETREK SUN-TL-HP12K-A1 3 pha',
    slug: 'biến-tần-hybrid-hopetrek-sun-tl-hp12k-a1-3-pha',
    brand: 'HOPETREK',
    category: 'hybrid-inverter',
    model: '3 pha',
    description: 'Biến tần Hybrid HOPETREK SUN-TL-HP12K-A1 3 pha - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'HOPETREK',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 42424000,
    main_image: '/images/products/260603.png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    phase: '3-phase',
    voltage: 'low',
  },
  {
    id: 'gpg-86',
    name: 'Biến tần Hybrid HOPETREK SUN-TL-HP10K-A1 3 pha',
    slug: 'biến-tần-hybrid-hopetrek-sun-tl-hp10k-a1-3-pha',
    brand: 'HOPETREK',
    category: 'hybrid-inverter',
    model: '3 pha',
    description: 'Biến tần Hybrid HOPETREK SUN-TL-HP10K-A1 3 pha - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'HOPETREK',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 40579000,
    main_image: '/images/products/260603(1).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    phase: '3-phase',
    voltage: 'low',
  },
  {
    id: 'gpg-50',
    name: 'Biến tần Hybrid HOPETREK SUN-SL-HP6K-A1 1 pha',
    slug: 'biến-tần-hybrid-hopetrek-sun-sl-hp6k-a1-1-pha',
    brand: 'HOPETREK',
    category: 'hybrid-inverter',
    model: '1 pha',
    description: 'Biến tần Hybrid HOPETREK SUN-SL-HP6K-A1 1 pha - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'HOPETREK',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 20659000,
    main_image: '/images/products/260603(2).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    phase: '1-phase',
    voltage: 'low',
  },
  {
    id: 'gpg-29',
    name: 'Biến tần Hybrid HOPETREK SUN-SL-HP5K-A1 1 pha',
    slug: 'biến-tần-hybrid-hopetrek-sun-sl-hp5k-a1-1-pha',
    brand: 'HOPETREK',
    category: 'hybrid-inverter',
    model: '1 pha',
    description: 'Biến tần Hybrid HOPETREK SUN-SL-HP5K-A1 1 pha - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'HOPETREK',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 19921000,
    main_image: '/images/products/260603(3).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    phase: '1-phase',
    voltage: 'low',
  },
  {
    id: 'gpg-22',
    name: 'Pin lưu trữ GENIXGREEN 16.08kWh ES-BOX12F MAX+',
    slug: 'pin-lưu-trữ-genixgreen-1608kwh-es-box12f-max',
    brand: 'GENIXGREEN',
    category: 'lv-battery',
    model: 'ES-BOX12F MAX+',
    description: 'Pin lưu trữ GENIXGREEN 16.08kWh ES-BOX12F MAX+ - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'GENIXGREEN',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 10,
    unit_price: 40017000,
    main_image: '/images/products/260605.png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    
    voltage: 'low',
  },
  {
    id: 'gpg-27',
    name: 'Pin lưu trữ GENIXGREEN 14.34kWh ES-BOX12F MAX',
    slug: 'pin-lưu-trữ-genixgreen-1434kwh-es-box12f-max',
    brand: 'GENIXGREEN',
    category: 'lv-battery',
    model: 'ES-BOX12F MAX',
    description: 'Pin lưu trữ GENIXGREEN 14.34kWh ES-BOX12F MAX - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'GENIXGREEN',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 10,
    unit_price: 34567000,
    main_image: '/images/products/260605(4).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    
    voltage: 'low',
  },
  {
    id: 'gpg-25',
    name: 'Pin lưu trữ GENIXGREEN 14.34kWh ES-BOX34MAX',
    slug: 'pin-lưu-trữ-genixgreen-1434kwh-es-box34max',
    brand: 'GENIXGREEN',
    category: 'lv-battery',
    model: '14.34kWh ES-BOX34MAX',
    description: 'Pin lưu trữ GENIXGREEN 14.34kWh ES-BOX34MAX - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'GENIXGREEN',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 10,
    unit_price: 32695000,
    main_image: '/images/products/260605(4).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    
    voltage: 'low',
  },
  {
    id: 'gpg-63',
    name: 'Biến tần Hybrid SAJ 18kW 3 Pha H2-18K-LT2',
    slug: 'biến-tần-hybrid-saj-18kw-3-pha-h2-18k-lt2',
    brand: 'SAJ',
    category: 'hybrid-inverter',
    model: 'Pha H2-18K-LT2',
    description: 'Biến tần Hybrid SAJ 18kW 3 Pha H2-18K-LT2 - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'SAJ',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 54006000,
    main_image: '/images/products/260603(4).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    
    
  },
  {
    id: 'gpg-9',
    name: 'Biến tần Hybrid SAJ 16kW 3 Pha H2-16K-LT2',
    slug: 'biến-tần-hybrid-saj-16kw-3-pha-h2-16k-lt2',
    brand: 'SAJ',
    category: 'hybrid-inverter',
    model: 'Pha H2-16K-LT2',
    description: 'Biến tần Hybrid SAJ 16kW 3 Pha H2-16K-LT2 - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'SAJ',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 42833000,
    main_image: '/images/products/260603(5).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    
    
  },
  {
    id: 'gpg-96',
    name: 'Biến tần Hybrid SAJ 12kW 3 Pha H2-12K-LT2',
    slug: 'biến-tần-hybrid-saj-12kw-3-pha-h2-12k-lt2',
    brand: 'SAJ',
    category: 'hybrid-inverter',
    model: 'Pha H2-12K-LT2',
    description: 'Biến tần Hybrid SAJ 12kW 3 Pha H2-12K-LT2 - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'SAJ',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 37619000,
    main_image: '/images/products/260603(5).png',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    
    
  },
  {
    id: 'gpg-26',
    name: 'Biến tần Hybrid SAJ 12kW 1 Pha H2-12K-LS2',
    slug: 'biến-tần-hybrid-saj-12kw-1-pha-h2-12k-ls2',
    brand: 'SAJ',
    category: 'hybrid-inverter',
    model: 'Pha H2-12K-LS2',
    description: 'Biến tần Hybrid SAJ 12kW 1 Pha H2-12K-LS2 - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'SAJ',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 31287000,
    main_image: '/images/products/260522.jpeg',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    
    
  },
  {
    id: 'gpg-92',
    name: 'Biến tần Hybrid SAJ 10kW 1 Pha H2-10K-LS2',
    slug: 'biến-tần-hybrid-saj-10kw-1-pha-h2-10k-ls2',
    brand: 'SAJ',
    category: 'hybrid-inverter',
    model: 'Pha H2-10K-LS2',
    description: 'Biến tần Hybrid SAJ 10kW 1 Pha H2-10K-LS2 - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'SAJ',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 29797000,
    main_image: '/images/products/260522.jpeg',
    is_available: true,
    show_on_homepage: false,
    product_type: 'inverter',
    
    
  },
  {
    id: 'gpg-40',
    name: 'Biến tần Biến tần Hybrid SAJ 8kW 1 Pha H2-8K-LS2',
    slug: 'biến-tần-biến-tần-hybrid-saj-8kw-1-pha-h2-8k-ls2',
    brand: 'SAJ',
    category: 'panel',
    model: 'Pha H2-8K-LS2',
    description: 'Biến tần Biến tần Hybrid SAJ 8kW 1 Pha H2-8K-LS2 - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'SAJ',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 25886000,
    main_image: '/images/products/260522.jpeg',
    is_available: true,
    show_on_homepage: true,
    product_type: 'panel',
    
    
  },
  {
    id: 'gpg-31',
    name: 'Biến tần Biến tần Hybrid SAJ 6kW 1 Pha H2-6K-LS2',
    slug: 'biến-tần-biến-tần-hybrid-saj-6kw-1-pha-h2-6k-ls2',
    brand: 'SAJ',
    category: 'panel',
    model: 'Pha H2-6K-LS2',
    description: 'Biến tần Biến tần Hybrid SAJ 6kW 1 Pha H2-6K-LS2 - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'SAJ',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 16575000,
    main_image: '/images/products/260522.jpeg',
    is_available: true,
    show_on_homepage: true,
    product_type: 'panel',
    
    
  },
  {
    id: 'gpg-9',
    name: 'Tấm mô-đun quang điện Tấm pin mặt trời AIKO 650W mặt kính Stellar 2N+66',
    slug: 'tấm-mô-đun-quang-điện-tấm-pin-mặt-trời-aiko-650w-mặt-kính-stellar-2n66',
    brand: 'AIKO',
    category: 'panel',
    model: 'Stellar 2N+66',
    description: 'Tấm mô-đun quang điện Tấm pin mặt trời AIKO 650W mặt kính Stellar 2N+66 - Sản phẩm chính hãng, bảo hành uy tín',
    specifications: {
      'Xuất xứ': 'AIKO',
      'Bảo hành': 'Xem chi tiết'
    },
    features: [
      'Chính hãng 100%',
      'Bảo hành toàn quốc',
      'Hỗ trợ kỹ thuật 24/7'
    ],
    warranty_years: 5,
    unit_price: 2399000,
    main_image: '/images/products/260605(1).png',
    is_available: true,
    show_on_homepage: true,
    product_type: 'panel',
    
    
  }
];

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  if (filters.brand) {
    const brand = filters.brand.toLowerCase();
    filtered = filtered.filter(p => p.brand.toLowerCase() === brand);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q)
    );
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.unit_price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.unit_price <= filters.maxPrice!);
  }

  if (filters.productType) {
    filtered = filtered.filter(p => p.product_type === filters.productType);
  }

  if (filters.phase) {
    filtered = filtered.filter(p => p.phase === filters.phase);
  }

  if (filters.voltage) {
    filtered = filtered.filter(p => p.voltage === filters.voltage);
  }

  return filtered;
}
