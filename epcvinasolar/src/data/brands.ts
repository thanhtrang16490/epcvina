// Local brands data
export interface LocalBrand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website?: string;
  country?: string;
  years_active?: number;
}

export const localBrands: LocalBrand[] = [
  {
    id: 'aiko',
    name: 'AIKO',
    slug: 'aiko',
    description: 'Nhà sản xuất tấm pin năng lượng mặt trời hàng đầu với công nghệ ABC',
    logo_url: '/brands/aiko.png',
    website: 'https://www.aikosolar.com',
    country: 'Trung Quốc',
    years_active: 10,
  },
  {
    id: 'huawei',
    name: 'Huawei',
    slug: 'huawei',
    description: 'Tập đoàn công nghệ đa quốc gia Trung Quốc',
    logo_url: '/brands/huawei.jpg',
    website: 'https://www.huawei.com',
    country: 'Trung Quốc',
    years_active: 37,
  },
  {
    id: 'growatt',
    name: 'Growatt',
    slug: 'growatt',
    description: 'Nhà sản xuất biến tần năng lượng mặt trời',
    logo_url: '/brands/growatt.png',
    website: 'https://www.ginlong.com',
    country: 'Trung Quốc',
    years_active: 16,
  },
  {
    id: 'pylontech',
    name: 'Pylontech',
    slug: 'pylontech',
    description: 'Chuyên gia về pin lithium cho hệ thống năng lượng',
    logo_url: '/brands/pylontech.svg',
    website: 'https://www.pylontech.com.cn',
    country: 'Trung Quốc',
    years_active: 15,
  },
  {
    id: 'epcvina',
    name: 'EPCVINA',
    slug: 'epcvina',
    description: 'Nhà cung cấp thiết bị điện mặt trời Việt Nam',
    logo_url: '/brands/epcvina.png',
    website: 'https://epcvina.com',
    country: 'Việt Nam',
    years_active: 8,
  },
  {
    id: 'quang-minh-tech',
    name: 'QUANG MINH TECH',
    slug: 'quang-minh-tech',
    description: 'Nhà sản xuất phụ kiện lắp đặt hệ thống điện mặt trời',
    logo_url: '/brands/quang-minh-tech.svg',
    country: 'Việt Nam',
    years_active: 6,
  },
  {
    id: 'saj',
    name: 'SAJ',
    slug: 'saj',
    description: 'Nhà sản xuất biến tần năng lượng mặt trời hàng đầu',
    logo_url: '/brands/saj.png',
    website: 'https://www.saj-electric.com',
    country: 'Trung Quốc',
    years_active: 20,
  },
  {
    id: 'hope-trek',
    name: 'Hope Trek',
    slug: 'hope-trek',
    description: 'Nhà sản xuất biến tần và hệ thống lưu trữ năng lượng',
    logo_url: '/brands/hope-trek.png',
    country: 'Trung Quốc',
    years_active: 12,
  },
  {
    id: 'leader',
    name: 'Leader',
    slug: 'leader',
    description: 'Nhà sản xuất dây cáp điện năng lượng mặt trời',
    logo_url: '/brands/leader.png',
    country: 'Việt Nam',
    years_active: 11,
  },
  {
    id: 'genix-green',
    name: 'Genix Green',
    slug: 'genix-green',
    description: 'Thương hiệu thiết bị điện mặt trời',
    logo_url: '/brands/genix-green.png',
    country: 'Việt Nam',
    years_active: 7,
  },
  {
    id: 'deye',
    name: 'Deye',
    slug: 'deye',
    description: 'Nhà sản xuất biến tần năng lượng mặt trời và thiết bị gia dụng',
    logo_url: '/brands/deye.png',
    website: 'https://www.deyeinverter.com',
    country: 'Trung Quốc',
    years_active: 19,
  },
  {
    id: 'longi',
    name: 'Longi',
    slug: 'longi',
    description: 'Nhà sản xuất tấm pin năng lượng mặt trời hàng đầu thế giới',
    logo_url: '/brands/longi.png',
    website: 'https://www.longi.com',
    country: 'Trung Quốc',
    years_active: 24,
  },
  {
    id: 'ja-solar',
    name: 'JA Solar',
    slug: 'ja-solar',
    description: 'Nhà sản xuất tấm pin năng lượng mặt trời hàng đầu thế giới với công nghệ N-Type TOPCon',
    logo_url: '',
    website: 'https://www.jasolar.com',
    country: 'Trung Quốc',
    years_active: 26,
  },
  {
    id: 'canadian-solar',
    name: 'Canadian Solar',
    slug: 'canadian-solar',
    description: 'Nhà sản xuất tấm pin năng lượng mặt trời toàn cầu với công nghệ N-Type TOPCon và Mono PERC',
    logo_url: '/brands/canadian-solar.png',
    website: 'https://www.canadiansolar.com',
    country: 'Canada',
    years_active: 23,
  },
  {
    id: 'sharp',
    name: 'Sharp',
    slug: 'sharp',
    description: 'Thương hiệu điện tử Nhật Bản với dòng tấm pin N-Type TOPCon công nghệ tiên tiến',
    logo_url: '/brands/sharp.png',
    website: 'https://www.sharp.com',
    country: 'Nhật Bản',
    years_active: 109,
  },
  {
    id: 'sungrow',
    name: 'Sungrow',
    slug: 'sungrow',
    description: 'Nhà sản xuất biến tần năng lượng mặt trời và hệ thống lưu trữ hàng đầu thế giới',
    logo_url: '/brands/sungrow.svg',
    website: 'https://www.sungrowpower.com',
    country: 'Trung Quốc',
    years_active: 27,
  },
  {
    id: 'cfe',
    name: 'CFE',
    slug: 'cfe',
    description: 'Nhà sản xuất pin lưu trữ năng lượng cao áp cho hệ thống điện mặt trời',
    logo_url: '/brands/cfe.png',
    country: 'Trung Quốc',
    years_active: 9,
  },
];

export function getBrands(): LocalBrand[] {
  return localBrands.sort((a, b) => a.name.localeCompare(b.name));
}

export function getBrandBySlug(slug: string): LocalBrand | undefined {
  return localBrands.find(b => b.slug === slug);
}
