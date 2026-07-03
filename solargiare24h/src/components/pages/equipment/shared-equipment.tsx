import { Zap, TrendingUp, Battery, Shield, Wrench } from 'lucide-react';
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
    icon: <Zap className="h-5 w-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    accent: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600',
    description: 'Tấm pin mặt trời hiệu suất cao từ các thương hiệu Tier 1, công nghệ Mono/Poly PERC, bảo hành hiệu suất lên đến 25 năm.',
  },
  inverter: {
    label: 'Biến tần / Inverter',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    accent: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
    description: 'Bộ biến tần hòa lưới hiệu suất chuyển đổi đến 99%, tích hợp MPPT thông minh, phù hợp hệ thống điện mặt trời nối lưới.',
  },
  battery: {
    label: 'Pin lưu trữ',
    icon: <Battery className="h-5 w-5" />,
    color: 'text-green-600',
    bg: 'bg-green-50',
    accent: 'bg-green-500',
    gradient: 'from-green-400 to-green-600',
    description: 'Pin lưu trữ chính hãng, tích hợp BMS thông minh, bảo hành 5-10 năm, phù hợp hệ thống gia đình và thương mại.',
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
