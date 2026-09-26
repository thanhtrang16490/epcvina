import { Lightning, TrendUp, BatteryHigh, Shield, Plug, Wrench, Stack, CableCar } from '@phosphor-icons/react';
import type { EquipmentCategory } from '../../../lib/types';

// ─────────────────────────────────────────────
// Format currency helper
// ─────────────────────────────────────────────
export function formatCurrency(value: number): string {
  if (value >= 1000000000) return (value / 1000000000).toFixed(1) + ' tỷ';
  if (value >= 1000000) return (value / 1000000).toFixed(1) + ' triệu';
  if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
  return value.toString();
}

// ─────────────────────────────────────────────
// Category metadata (unified for Mobile + Desktop)
// ─────────────────────────────────────────────
export interface CategoryMeta {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  accent: string;
  gradient: string;
  description: string;
}

export const CATEGORY_META: Record<EquipmentCategory, CategoryMeta> = {
  panel: {
    label: 'Tấm mô-đun quang điện',
    icon: <Lightning className="h-5 w-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    accent: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600',
    description: 'Tấm pin mặt trời hiệu suất cao từ các thương hiệu Tier 1, công nghệ Mono/Poly PERC, bảo hành hiệu suất lên đến 25 năm.',
  },
  'on-grid-inverter': {
    label: 'Biến tần On-Grid',
    icon: <TrendUp className="h-5 w-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    accent: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
    description: 'Bộ biến tần hòa lưới hiệu suất chuyển đổi đến 99%, tích hợp MPPT thông minh, phù hợp hệ thống điện mặt trời nối lưới.',
  },
  'hybrid-inverter': {
    label: 'Biến tần Hybrid',
    icon: <TrendUp className="h-5 w-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    accent: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600',
    description: 'Bộ biến tần Hybrid kết hợp điện mặt trời và lưu trữ pin, tối ưu tự dùng, đảm bảo nguồn điện liên tục 24/7.',
  },
  'lv-battery': {
    label: 'Pin lưu trữ áp thấp',
    icon: <BatteryHigh className="h-5 w-5" />,
    color: 'text-green-600',
    bg: 'bg-green-50',
    accent: 'bg-green-500',
    gradient: 'from-green-400 to-green-600',
    description: 'Pin lưu trữ áp thấp 48V dễ lắp đặt, phù hợp hệ thống gia đình và thương mại nhỏ, tích hợp BMS thông minh.',
  },
  'hv-battery': {
    label: 'Pin lưu trữ áp cao',
    icon: <BatteryHigh className="h-5 w-5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    accent: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600',
    description: 'Pin lưu trữ áp cao hiệu suất cao, phù hợp hệ thống công suất lớn, giảm tổn hao truyền tải và tăng hiệu quả lưu trữ.',
  },
  mounting: {
    label: 'Hệ khung nhôm',
    icon: <Stack className="h-5 w-5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    accent: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600',
    description: 'Hệ khung nhôm hợp kim cường độ cao, chống ăn mòn, chịu được gió bão cấp 12, phù hợp mọi loại mái và địa hình.',
  },
  wiring: {
    label: 'Hệ dây điện',
    icon: <CableCar className="h-5 w-5" />,
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    accent: 'bg-gray-500',
    gradient: 'from-gray-400 to-gray-600',
    description: 'Dây điện và đầu nối chuyên dụng cho điện mặt trời, chịu được tia UV, nhiệt độ cao, đảm bảo an toàn và bền bỉ.',
  },
  cabinet: {
    label: 'Tủ điện',
    icon: <Shield className="h-5 w-5" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    accent: 'bg-indigo-500',
    gradient: 'from-indigo-400 to-indigo-600',
    description: 'Tủ điện phân phối và bảo vệ hệ thống, tích hợp APTomat, chống sét lan, đảm bảo an toàn điện cho toàn hệ thống.',
  },
  grounding: {
    label: 'Hệ tiếp địa',
    icon: <Plug className="h-5 w-5" />,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    accent: 'bg-yellow-500',
    gradient: 'from-yellow-400 to-yellow-600',
    description: 'Hệ thống tiếp địa và chống sét, bảo vệ thiết bị và con người, đảm bảo an toàn cho toàn bộ hệ thống điện mặt trời.',
  },
  accessories: {
    label: 'Phụ kiện lắp đặt',
    icon: <Wrench className="h-5 w-5" />,
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    accent: 'bg-gray-500',
    gradient: 'from-gray-400 to-gray-600',
    description: 'Phụ kiện lắp đặt đầy đủ: bulong, kẹp biên, kẹp giữa, ray trượt, khớp nối... hoàn thiện hệ thống điện mặt trời.',
  },
};

export const DEFAULT_CATEGORY_META: CategoryMeta = {
  label: 'Thiết bị điện mặt trời',
  icon: <Wrench className="h-5 w-5" />,
  color: 'text-slate-600',
  bg: 'bg-slate-100',
  accent: 'bg-slate-500',
  gradient: 'from-slate-400 to-slate-600',
  description: 'Danh mục thiết bị đang được cập nhật. Đội ngũ EPCVINA có thể tư vấn cấu hình tương đương theo nhu cầu của bạn.',
};

export function getCategoryMeta(category?: string): CategoryMeta {
  return (category && CATEGORY_META[category as EquipmentCategory]) || DEFAULT_CATEGORY_META;
}
