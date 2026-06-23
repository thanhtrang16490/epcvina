// Combo data synced from epcvinasolar
export interface MiniCombo {
  id: number;
  title: string;
  slug: string;
  system_type: 'on-grid' | 'hybrid';
  phase: '1-phase' | '3-phase';
  power_kw: number;
  battery_kwh?: number;
  investment_million_vnd: number;
  production_min_kwh: number;
  production_max_kwh: number;
  payback_years: number;
  payback_label: string;
  roof_area_m2?: number;
  description: string;
  features: string[];
  image: string;
}

// On-Grid Combos from epcvinasolar
export const onGridCombos: MiniCombo[] = [
  {
    id: 1,
    title: "On-Grid 5 kWp 1 pha",
    slug: "on-grid-5kw-1pha",
    system_type: "on-grid",
    phase: "1-phase",
    power_kw: 5,
    investment_million_vnd: 60,
    production_min_kwh: 350,
    production_max_kwh: 450,
    payback_years: 4.25,
    payback_label: "4 năm 3 tháng",
    description: "Giải pháp điện mặt trời on-grid 1 pha công suất 5 kWp, phù hợp hộ gia đình.",
    features: [
      "Không cần pin lưu trữ",
      "Hoàn vốn nhanh 4.25 năm",
      "Tiết kiệm 70-90% tiền điện",
      "Sản lượng 350-450 kWh/tháng",
    ],
    image: "https://via.placeholder.com/800x600/DC2626/FFFFFF?text=On-Grid+5KW",
  },
  {
    id: 2,
    title: "On-Grid 8.8 kWp 1 pha",
    slug: "on-grid-8.8kw-1pha",
    system_type: "on-grid",
    phase: "1-phase",
    power_kw: 8.8,
    investment_million_vnd: 105,
    production_min_kwh: 600,
    production_max_kwh: 750,
    payback_years: 4.5,
    payback_label: "4 năm 6 tháng",
    description: "Hệ thống on-grid 1 pha công suất 8.8 kWp cho gia đình sử dụng nhiều điện.",
    features: [
      "Công suất lớn 8.8 kWp",
      "Sản lượng 600-750 kWh/tháng",
      "Bảo hành 25 năm tấm pin",
      "Giám sát từ xa 24/7",
    ],
    image: "https://via.placeholder.com/800x600/B91C1C/FFFFFF?text=On-Grid+8.8KW",
  },
  {
    id: 3,
    title: "On-Grid 10.7 kWp 3 pha",
    slug: "on-grid-10.7kw-3pha",
    system_type: "on-grid",
    phase: "3-phase",
    power_kw: 10.7,
    investment_million_vnd: 128,
    production_min_kwh: 900,
    production_max_kwh: 1100,
    payback_years: 4.0,
    payback_label: "4 năm",
    description: "Giải pháp 3 pha cho doanh nghiệp, văn phòng, cửa hàng.",
    features: [
      "Hệ thống 3 pha ổn định",
      "Sản lượng 900-1100 kWh/tháng",
      "Phù hợp doanh nghiệp nhỏ",
      "Hoàn vốn nhanh 4 năm",
    ],
    image: "https://via.placeholder.com/800x600/991B1B/FFFFFF?text=On-Grid+10.7KW",
  },
  {
    id: 4,
    title: "On-Grid 15.7 kWp 3 pha",
    slug: "on-grid-15.7kw-3pha",
    system_type: "on-grid",
    phase: "3-phase",
    power_kw: 15.7,
    investment_million_vnd: 188,
    production_min_kwh: 1300,
    production_max_kwh: 1600,
    payback_years: 3.75,
    payback_label: "3 năm 9 tháng",
    description: "Hệ thống công suất lớn cho nhà xưởng, doanh nghiệp vừa.",
    features: [
      "Công suất 15.7 kWp",
      "Sản lượng 1300-1600 kWh/tháng",
      "Tối ưu cho nhà xưởng",
      "Hiệu suất cao",
    ],
    image: "https://via.placeholder.com/800x600/7F1D1D/FFFFFF?text=On-Grid+15.7KW",
  },
];

// Hybrid Combos from epcvinasolar
export const hybridCombos: MiniCombo[] = [
  {
    id: 5,
    title: "Hybrid 10.7 kWp 1 pha – 5.12 kWh",
    slug: "hybrid-10.7kw-1pha-5kwh",
    system_type: "hybrid",
    phase: "1-phase",
    power_kw: 10.7,
    battery_kwh: 5.12,
    investment_million_vnd: 155,
    production_min_kwh: 900,
    production_max_kwh: 1200,
    payback_years: 4.5,
    payback_label: "4 năm 6 tháng",
    description: "Hệ hybrid có lưu trữ 5.12 kWh, hoạt động 24/7, dự phòng khi mất điện.",
    features: [
      "Pin lưu trữ 5.12 kWh",
      "Hoạt động khi mất điện",
      "Sản lượng 900-1200 kWh/tháng",
      "Tự chủ năng lượng",
    ],
    image: "https://via.placeholder.com/800x600/DC2626/FFFFFF?text=Hybrid+10.7KW+5KWh",
  },
  {
    id: 6,
    title: "Hybrid 10.7 kWp 1 pha – 10.24 kWh",
    slug: "hybrid-10.7kw-1pha-10kwh",
    system_type: "hybrid",
    phase: "1-phase",
    power_kw: 10.7,
    battery_kwh: 10.24,
    investment_million_vnd: 174.5,
    production_min_kwh: 900,
    production_max_kwh: 1200,
    payback_years: 4.67,
    payback_label: "4 năm 8 tháng",
    roof_area_m2: 45.9,
    description: "Hệ hybrid lưu trữ lớn 10.24 kWh, phù hợp gia đình sử dụng nhiều điện.",
    features: [
      "Pin lưu trữ 10.24 kWh",
      "Dự phòng dài khi mất điện",
      "Sản lượng 900-1200 kWh/tháng",
      "Diện tích mái 45.9 m²",
    ],
    image: "https://via.placeholder.com/800x600/B91C1C/FFFFFF?text=Hybrid+10.7KW+10KWh",
  },
  {
    id: 7,
    title: "Hybrid 10.7 kWp 3 pha – 5.12 kWh",
    slug: "hybrid-10.7kw-3pha-5kwh",
    system_type: "hybrid",
    phase: "3-phase",
    power_kw: 10.7,
    battery_kwh: 5.12,
    investment_million_vnd: 165,
    production_min_kwh: 900,
    production_max_kwh: 1200,
    payback_years: 4.5,
    payback_label: "4 năm 6 tháng",
    description: "Hệ hybrid 3 pha có lưu trữ, phù hợp doanh nghiệp nhỏ cần dự phòng.",
    features: [
      "Hệ thống 3 pha ổn định",
      "Pin lưu trữ 5.12 kWh",
      "Hoạt động 24/7",
      "Phù hợp văn phòng, cửa hàng",
    ],
    image: "https://via.placeholder.com/800x600/991B1B/FFFFFF?text=Hybrid+3-Phase+5KWh",
  },
  {
    id: 8,
    title: "Hybrid 10.7 kWp 3 pha – 16 kWh",
    slug: "hybrid-10.7kw-3pha-16kwh",
    system_type: "hybrid",
    phase: "3-phase",
    power_kw: 10.7,
    battery_kwh: 16,
    investment_million_vnd: 215,
    production_min_kwh: 900,
    production_max_kwh: 1200,
    payback_years: 5.0,
    payback_label: "5 năm",
    description: "Hệ hybrid 3 pha lưu trữ lớn 16 kWh, tối ưu cho doanh nghiệp.",
    features: [
      "Pin lưu trữ lớn 16 kWh",
      "Dự phòng dài hạn",
      "Hệ thống 3 pha mạnh mẽ",
      "Tự chủ năng lượng hoàn toàn",
    ],
    image: "https://via.placeholder.com/800x600/7F1D1D/FFFFFF?text=Hybrid+3-Phase+16KWh",
  },
];

// All combos combined
export const combos: MiniCombo[] = [...onGridCombos, ...hybridCombos];
