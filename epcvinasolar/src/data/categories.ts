// Local categories data
export interface LocalCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  display_order?: number;
}

export const localCategories: LocalCategory[] = [
  {
    id: 'panel',
    name: 'Tấm quang năng',
    slug: 'panel',
    description: 'Tấm pin năng lượng mặt trời',
    display_order: 1,
  },
  {
    id: 'mounting',
    name: 'Hệ khung nhôm',
    slug: 'mounting',
    description: 'Hệ thống khung nhôm lắp đặt',
    display_order: 2,
  },
  {
    id: 'wiring',
    name: 'Hệ dây điện',
    slug: 'wiring',
    description: 'Dây điện và cáp DC',
    display_order: 3,
  },
  {
    id: 'cabinet',
    name: 'Tủ điện',
    slug: 'cabinet',
    description: 'Tủ điện DC/AC',
    display_order: 4,
  },
  {
    id: 'grounding',
    name: 'Hệ tiếp địa',
    slug: 'grounding',
    description: 'Hệ thống tiếp địa an toàn',
    display_order: 5,
  },
  {
    id: 'on-grid-1phase',
    name: 'Biến tần On-Grid 1 Pha',
    slug: 'on-grid-1phase',
    display_order: 6,
  },
  {
    id: 'on-grid-3phase-lv',
    name: 'Biến tần On-Grid 3 Pha',
    slug: 'on-grid-3phase-lv',
    display_order: 7,
  },
  {
    id: 'on-grid-3phase-hv',
    name: 'Biến tần On-Grid 3 Pha Công Suất Lớn',
    slug: 'on-grid-3phase-hv',
    display_order: 8,
  },
  {
    id: 'hybrid-1phase',
    name: 'Biến tần Hybrid 1 Pha',
    slug: 'hybrid-1phase',
    display_order: 9,
  },
  {
    id: 'hybrid-3phase-lv',
    name: 'Biến tần Hybrid 3 Pha Áp Thấp',
    slug: 'hybrid-3phase-lv',
    display_order: 10,
  },
  {
    id: 'hybrid-3phase-hv',
    name: 'Biến tần Hybrid 3 Pha Áp Cao',
    slug: 'hybrid-3phase-hv',
    display_order: 11,
  },
  {
    id: 'hybrid-inverter',
    name: 'Biến tần Hybrid',
    slug: 'hybrid-inverter',
    display_order: 12,
  },
  {
    id: 'lv-battery',
    name: 'Pin lưu trữ áp thấp',
    slug: 'lv-battery',
    display_order: 13,
  },
  {
    id: 'hv-battery',
    name: 'Pin lưu trữ áp cao',
    slug: 'hv-battery',
    display_order: 14,
  },
  {
    id: 'meter',
    name: 'Đồng hồ đo',
    slug: 'meter',
    display_order: 15,
  },
];

export function getCategories(): LocalCategory[] {
  return localCategories.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

export function getCategoryBySlug(slug: string): LocalCategory | undefined {
  return localCategories.find(c => c.slug === slug);
}
