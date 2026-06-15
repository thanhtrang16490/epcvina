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
    id: 'ja-solar',
    name: 'JA Solar',
    slug: 'ja-solar',
    description: 'Nhà sản xuất tấm pin năng lượng mặt trời hàng đầu thế giới',
    logo_url: '/brands/ja-solar.png',
    website: 'https://www.jasolar.com',
    country: 'China',
  },
  {
    id: 'canadian-solar',
    name: 'Canadian Solar',
    slug: 'canadian-solar',
    description: 'Tập đoàn năng lượng mặt trời Canada',
    logo_url: '/brands/canadian-solar.png',
    website: 'https://www.canadiansolar.com',
    country: 'Canada',
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
    id: 'gpg-solar',
    name: 'GPG Solar',
    slug: 'gpg-solar',
    description: 'Nhà cung cấp thiết bị điện mặt trời Việt Nam',
    logo_url: '/brands/gpg-solar.png',
    website: 'https://gpgsolar.vn',
    country: 'Vietnam',
  },
];

export function getBrands(): LocalBrand[] {
  return localBrands.sort((a, b) => a.name.localeCompare(b.name));
}

export function getBrandBySlug(slug: string): LocalBrand | undefined {
  return localBrands.find(b => b.slug === slug);
}
