// Product data synced from epcvinasolar
export interface MiniProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  categoryId?: number;
  model: string;
  description: string;
  price?: number;
  main_image: string;
  specifications?: Record<string, string>;
  features?: string[];
  warranty?: string;
}

export interface MiniCategory {
  id: number;
  name: string;
  image: string;
  description: string;
}

// Categories based on epcvinasolar product structure
export const categories: MiniCategory[] = [
  {
    id: 1,
    name: "Tấm pin mặt trời",
    image: "/images/products/260424.png",
    description: "Tấm pin năng lượng mặt trời chính hãng",
  },
  {
    id: 2,
    name: "Inverter",
    image: "/images/products/inverter.png",
    description: "Biến tần hòa lưới và hybrid",
  },
  {
    id: 3,
    name: "Pin lưu trữ",
    image: "/images/products/battery.png",
    description: "Hệ thống lưu trữ năng lượng",
  },
  {
    id: 4,
    name: "Phụ kiện",
    image: "/images/products/accessories.png",
    description: "Cáp, đầu nối và tủ điện",
  },
];

// Products from epcvinasolar content
export const products: MiniProduct[] = [
  {
    id: 1,
    name: "Tấm pin mặt trời Aiko 680W Mặt Kính Stellar 2N 66-231",
    brand: "AIKO",
    category: "panel",
    model: "Stellar 2N 66-231",
    description:
      "Tấm pin AIKO Solar 680W ứng dụng công nghệ N-type ABC độc quyền với hiệu suất vượt trội 25.2%. Tối ưu cho nhà xưởng, văn phòng, khách sạn.",
    main_image: "/images/products/260424.png",
    specifications: {
      "Công suất": "680W",
      "Hiệu suất": "25.2%",
      "Loại cell": "N-Type ABC",
      "Số lượng cell": "132 (6×22)",
      "Kích thước": "2382 x 1134 x 30mm",
      "Trọng lượng": "32.5kg",
      "Bảo hành": "15 năm sản phẩm, 30 năm hiệu suất",
    },
    features: [
      "Công nghệ cell N-Type ABC đột phá",
      "Hiệu suất dẫn đầu trên 25%",
      "Thiết kế 2 mặt kính tăng sản lượng điện",
      "Độ bền cơ học vượt trội",
      "Khả năng hoạt động tốt khi bị che bóng",
    ],
    warranty: "15 năm sản phẩm, 30 năm hiệu suất",
  },
  {
    id: 2,
    name: "Tấm pin mặt trời JA Solar 580W Bifacial JAM72D40-545-580/MB",
    brand: "JA Solar",
    category: "panel",
    model: "JAM72D40-545-580/MB",
    description:
      "Tấm pin JA Solar 580W công nghệ PERC bifacial, hiệu suất cao, phù hợp hệ thống commercial và industrial.",
    main_image: "/images/products/ja-solar-580w.png",
    specifications: {
      "Công suất": "580W",
      "Hiệu suất": "22.3%",
      "Loại cell": "PERC Bifacial",
      "Số lượng cell": "144 (6×24)",
      "Hệ số Bifacial": "70±5%",
      "Kích thước": "2278 x 1134 x 35mm",
      "Bảo hành": "12 năm sản phẩm, 25 năm hiệu suất",
    },
    features: [
      "Công nghệ PERC tiên tiến",
      "Thiết kế bifacial 2 mặt",
      "Hiệu suất cao 22.3%",
      "Độ bền vượt trội",
      "Chống PID xuất sắc",
    ],
    warranty: "12 năm sản phẩm, 25 năm hiệu suất",
  },
  {
    id: 3,
    name: "Inverter hòa lưới Huawei SUN2000-100KTL-M2",
    brand: "Huawei",
    category: "inverter",
    model: "SUN2000-100KTL-M2",
    description:
      "Inverter hòa lưới Huawei 100KW 3 pha, hiệu suất cao 98.8%, tích hợp AI tối ưu hóa sản lượng điện.",
    main_image: "/images/products/huawei-100ktl.png",
    specifications: {
      "Công suất AC": "100kW",
      "Hiệu suất tối đa": "98.8%",
      "Điện áp DC tối đa": "1100V",
      "Số MPPT": "10",
      "Dải điện áp MPPT": "200-1000V",
      "Bảo vệ": "IP66",
      "Làm mát": "Làm mát thông minh",
      "Bảo hành": "5 năm (có thể mở rộng)",
    },
    features: [
      "Hiệu suất chuyển đổi 98.8%",
      "Tích hợp AI tối ưu hóa",
      "10 MPPT độc lập",
      "Bảo vệ IP66",
      "Giám sát thông minh qua FusionSolar",
    ],
    warranty: "5 năm (có thể mở rộng lên 10 năm)",
  },
  {
    id: 4,
    name: "Inverter Hybrid Deye SUN-8K-SG04LP3-EU",
    brand: "Deye",
    category: "inverter",
    model: "SUN-8K-SG04LP3-EU",
    description:
      "Inverter Hybrid Deye 8KW 3 pha, tương thích pin lưu trữ điện áp thấp, phù hợp hệ thống gia đình và thương mại.",
    main_image: "/images/products/deye-8kw-hybrid.png",
    specifications: {
      "Công suất AC": "8kW",
      "Số pha": "3 pha",
      "Điện áp pin": "40-60V (Low Voltage)",
      "Hiệu suất": "97.6%",
      "Số MPPT": "2",
      "MPPT dòng tối đa": "16A",
      "Bảo vệ": "IP65",
      "Màn hình": "LCD + LED",
      "Bảo hành": "5 năm",
    },
    features: [
      "Tương thích pin điện áp thấp",
      "Hoạt động 24/7 với pin lưu trữ",
      "Chống ngược dòng thông minh",
      "Giám sát qua WiFi/LAN",
      "Dễ lắp đặt và cấu hình",
    ],
    warranty: "5 năm",
  },
  {
    id: 5,
    name: "Pin lưu trữ Huawei LUNA2000-15-S0",
    brand: "Huawei",
    category: "battery",
    model: "LUNA2000-15-S0",
    description:
      "Pin lưu trữ Huawei LUNA2000 15kWh, modular, tương thích inverter Huawei, quản lý thông minh qua AI.",
    main_image: "/images/products/huawei-luna-15kwh.png",
    specifications: {
      "Dung lượng": "15kWh",
      "Điện áp": "204-576V",
      "Loại pin": "LiFePO4",
      "Dung lượng khả dụng": "14.4kWh",
      "Hiệu suất round-trip": "96%",
      "Chu kỳ sạc": ">6000 cycles @ 90% DOD",
      "Bảo vệ": "IP65",
      "Trọng lượng": "165kg",
      "Bảo hành": "10 năm",
    },
    features: [
      "Thiết kế modular linh hoạt",
      "Công nghệ LFP an toàn",
      "Quản lý pin thông minh qua AI",
      "Hiệu suất 96%",
      "Tuổi thọ >6000 chu kỳ",
    ],
    warranty: "10 năm",
  },
  {
    id: 6,
    name: "Pin lưu trữ Deye SE-G5.1-Pro-LV",
    brand: "Deye",
    category: "battery",
    model: "SE-G5.1-Pro-LV",
    description:
      "Pin lưu trữ Deye 5.12kWh điện áp thấp, tương thích inverter Deye, dễ mở rộng, phù hợp hộ gia đình.",
    main_image: "/images/products/deye-battery-5kwh.png",
    specifications: {
      "Dung lượng": "5.12kWh",
      "Điện áp": "51.2V",
      "Loại pin": "LiFePO4",
      "Dung lượng khả dụng": "4.8kWh",
      "Dòng sạc/tối đa": "100A",
      "Chu kỳ sạc": ">6000 cycles @ 80% DOD",
      "Bảo vệ": "IP65",
      "Trọng lượng": "52kg",
      "Bảo hành": "5 năm",
    },
    features: [
      "Điện áp thấp an toàn",
      "Dễ lắp đặt và mở rộng",
      "Tương thích inverter Deye",
      "Quản lý qua app",
      "Tuổi thọ cao",
    ],
    warranty: "5 năm",
  },
  {
    id: 7,
    name: "Cáp điện DC Leader 4mm²",
    brand: "Leader",
    category: "accessories",
    model: "LEADER-DC-4MM2",
    description:
      "Cáp điện DC Leader 4mm² chuyên dụng cho hệ thống năng lượng mặt trời, chống UV, chịu nhiệt tốt.",
    main_image: "/images/products/cable-4mm2.png",
    specifications: {
      "Tiết diện": "4mm²",
      "Điện áp định mức": "DC 1500V",
      "Dòng điện tối đa": "70A",
      "Nhiệt độ hoạt động": "-40°C ~ +90°C",
      "Chống UV": "Có",
      "Tiêu chuẩn": "TÜV 2 PfG 1169/08.2012",
      "Màu sắc": "Đen/Đỏ",
    },
    features: [
      "Chống UV xuất sắc",
      "Chịu nhiệt cao",
      "Độ bền 25+ năm",
      "An toàn cho hệ DC",
      "Dễ uốn cong",
    ],
    warranty: "10 năm",
  },
  {
    id: 8,
    name: "Đầu nối MC4 Leader 1500V",
    brand: "Leader",
    category: "accessories",
    model: "MC4-1500V",
    description:
      "Đầu nối MC4 Leader 1500V tiêu chuẩn, tương thích mọi tấm pin, kết nối nhanh chóng và an toàn.",
    main_image: "/images/products/mc4-connector.png",
    specifications: {
      "Điện áp định mức": "DC 1500V",
      "Dòng điện định mức": "30A",
      "Tiết diện cáp": "2.5/4/6mm²",
      "Cấp bảo vệ": "IP68",
      "Vật liệu": "PPO",
      "Tiêu chuẩn": "TÜV/UL",
      "Nhiệt độ hoạt động": "-40°C ~ +85°C",
    },
    features: [
      "Kết nối nhanh chóng",
      "Chống nước IP68",
      "Tương thích rộng",
      "An toàn tuyệt đối",
      "Tuổi thọ 25+ năm",
    ],
    warranty: "10 năm",
  },
];
