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
    id: 'solar24h',
    name: 'Solar Giá Rẻ 24h',
    slug: 'solar24h',
    description: 'Nhà cung cấp thiết bị điện mặt trời',
    logo_url: '/favicon.svg',
    website: 'https://solargiare24h.com',
    country: 'Vietnam',
  },
];

export function getBrands(): LocalBrand[] {
  return localBrands.sort((a, b) => a.name.localeCompare(b.name));
}

export function getBrandBySlug(slug: string): LocalBrand | undefined {
  return localBrands.find(b => b.slug === slug);
}
