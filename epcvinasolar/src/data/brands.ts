// Local brands data
export interface LocalBrand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website?: string;
  country?: string;
}

export const localBrands: LocalBrand[] = [
  {
    id: 'aiko',
    name: 'AIKO',
    slug: 'aiko',
    description: 'Nhà sản xuất tấm pin năng lượng mặt trời hàng đầu với công nghệ ABC',
    logo_url: '/brands/aiko.png',
    website: 'https://www.aikosolar.com',
    country: 'China',
  },
  {
    id: 'huawei',
    name: 'Huawei',
    slug: 'huawei',
    description: 'Tập đoàn công nghệ đa quốc gia Trung Quốc',
    logo_url: '/brands/huawei.png',
    website: 'https://www.huawei.com',
    country: 'China',
  },
  {
    id: 'growatt',
    name: 'Growatt',
    slug: 'growatt',
    description: 'Nhà sản xuất biến tần năng lượng mặt trời',
    logo_url: '/brands/growatt.png',
    website: 'https://www.ginlong.com',
    country: 'China',
  },
  {
    id: 'pylontech',
    name: 'Pylontech',
    slug: 'pylontech',
    description: 'Chuyên gia về pin lithium cho hệ thống năng lượng',
    logo_url: '/brands/pylontech.png',
    website: 'https://www.pylontech.com.cn',
    country: 'China',
  },
  {
    id: 'epcvina',
    name: 'EPCVINA',
    slug: 'epcvina',
    description: 'Nhà cung cấp thiết bị điện mặt trời Việt Nam',
    logo_url: '/brands/epcvina.png',
    website: 'https://epcvina.com',
    country: 'Vietnam',
  },
  {
    id: 'quang-minh-tech',
    name: 'QUANG MINH TECH',
    slug: 'quang-minh-tech',
    description: 'Nhà sản xuất phụ kiện lắp đặt hệ thống điện mặt trời',
    logo_url: '/brands/qm-solar.png',
    country: 'Vietnam',
  },
  {
    id: 'saj',
    name: 'SAJ',
    slug: 'saj',
    description: 'Nhà sản xuất biến tần năng lượng mặt trời hàng đầu',
    logo_url: '/brands/saj.png',
    website: 'https://www.saj-electric.com',
    country: 'China',
  },
  {
    id: 'hope-trek',
    name: 'Hope Trek',
    slug: 'hope-trek',
    description: 'Nhà sản xuất biến tần và hệ thống lưu trữ năng lượng',
    logo_url: '/brands/hope-trek.png',
    country: 'China',
  },
  {
    id: 'leader',
    name: 'Leader',
    slug: 'leader',
    description: 'Nhà sản xuất dây cáp điện năng lượng mặt trời',
    logo_url: '/brands/leader.png',
    country: 'Vietnam',
  },
  {
    id: 'genix-green',
    name: 'Genix Green',
    slug: 'genix-green',
    description: 'Thương hiệu thiết bị điện mặt trời',
    logo_url: '/brands/genix-green.png',
    country: 'Vietnam',
  },
  {
    id: 'gpg-solar',
    name: 'GPG Solar',
    slug: 'gpg-solar',
    description: 'Nhà cung cấp giải pháp và thiết bị điện mặt trời',
    logo_url: '/brands/gpg-solar.png',
    country: 'Vietnam',
  },
  {
    id: 'deye',
    name: 'Deye',
    slug: 'deye',
    description: 'Nhà sản xuất biến tần năng lượng mặt trời và thiết bị gia dụng',
    logo_url: '/brands/deye.png',
    website: 'https://www.deyeinverter.com',
    country: 'China',
  },
  {
    id: 'longi',
    name: 'Longi',
    slug: 'longi',
    description: 'Nhà sản xuất tấm pin năng lượng mặt trời hàng đầu thế giới',
    logo_url: '/brands/longi.png',
    website: 'https://www.longi.com',
    country: 'China',
  },
];

export function getBrands(): LocalBrand[] {
  return localBrands.sort((a, b) => a.name.localeCompare(b.name));
}

export function getBrandBySlug(slug: string): LocalBrand | undefined {
  return localBrands.find(b => b.slug === slug);
}
