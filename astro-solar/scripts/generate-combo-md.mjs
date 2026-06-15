// Simple script to generate combo markdown files
// Run with: node --experimental-specifier-resolution=node scripts/generate-combo-md.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read combos data
const combosPath = path.join(__dirname, '../src/data/combos.ts');
const combosContent = fs.readFileSync(combosPath, 'utf-8');

// Extract localCombos array (simple parsing)
const match = combosContent.match(/export const localCombos: LocalCombo\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('❌ Could not parse combos data');
  process.exit(1);
}

// For simplicity, let's just define the data directly in this script
const localCombos = [
  { id: 'h1p-5-5', slug: 'hybrid-5kw-1pha-5kwh', name: 'Hy-Brid 5 kWp 1pha – 5.12 kWh', system_type: 'hybrid', phase: '1-phase', voltage: null, power_kw: 5, battery_kwh: 5.12, investment_million_vnd: 100.5, production_min_kwh: 500, production_max_kwh: 700, payback_years: 4.67, payback_label: '4 năm 8 tháng', roof_area_m2: 21.6, is_active: true, display_order: 1 },
  { id: 'h1p-5-10', slug: 'hybrid-5kw-1pha-10kwh', name: 'Hy-Brid 5 kWp 1pha – 10.24 kWh', system_type: 'hybrid', phase: '1-phase', voltage: null, power_kw: 5, battery_kwh: 10.24, investment_million_vnd: 123.6, production_min_kwh: 400, production_max_kwh: 600, payback_years: 6.83, payback_label: '6 năm 10 tháng', roof_area_m2: 21.6, is_active: true, display_order: 2 },
  { id: 'h1p-88-5', slug: 'hybrid-8.8kw-1pha-5kwh', name: 'Hy-Brid 8.8 kWp 1pha – 5.12 kWh', system_type: 'hybrid', phase: '1-phase', voltage: null, power_kw: 8.75, battery_kwh: 5.12, investment_million_vnd: 125.2, production_min_kwh: 600, production_max_kwh: 900, payback_years: 4.67, payback_label: '4 năm 8 tháng', roof_area_m2: 37.8, is_active: true, display_order: 3 },
  { id: 'h1p-88-10', slug: 'hybrid-8.8kw-1pha-10kwh', name: 'Hy-Brid 8.8 kWp 1pha – 10.24 kWh', system_type: 'hybrid', phase: '1-phase', voltage: null, power_kw: 8.75, battery_kwh: 10.24, investment_million_vnd: 148.3, production_min_kwh: 700, production_max_kwh: 1000, payback_years: 4.83, payback_label: '4 năm 10 tháng', roof_area_m2: 37.8, is_active: true, display_order: 4 },
  { id: 'h1p-107-5', slug: 'hybrid-10.7kw-1pha-5kwh', name: 'Hy-Brid 10.7 kWp 1pha – 5.12 kWh', system_type: 'hybrid', phase: '1-phase', voltage: null, power_kw: 10.63, battery_kwh: 5.12, investment_million_vnd: 151.4, production_min_kwh: 900, production_max_kwh: 1200, payback_years: 4.0, payback_label: '4 năm', roof_area_m2: 45.9, is_active: true, display_order: 5 },
  { id: 'h1p-88-16', slug: 'hybrid-8.8kw-1pha-16kwh', name: 'Hy-Brid 8.8 kWp 1pha – 16 kWh', system_type: 'hybrid', phase: '1-phase', voltage: null, power_kw: 8.75, battery_kwh: 16, investment_million_vnd: 164.8, production_min_kwh: 600, production_max_kwh: 900, payback_years: 6.17, payback_label: '6 năm 2 tháng', roof_area_m2: 37.8, is_active: true, display_order: 6 },
  { id: 'h1p-107-10', slug: 'hybrid-10.7kw-1pha-10kwh', name: 'Hy-Brid 10.7 kWp 1pha – 10.24 kWh', system_type: 'hybrid', phase: '1-phase', voltage: null, power_kw: 10.63, battery_kwh: 10.24, investment_million_vnd: 174.5, production_min_kwh: 900, production_max_kwh: 1200, payback_years: 4.67, payback_label: '4 năm 8 tháng', roof_area_m2: 45.9, is_active: true, display_order: 7 },
  { id: 'h1p-112-16', slug: 'hybrid-11.2kw-1pha-16kwh', name: 'Hy-Brid 11.2 kWp 1pha – 16 kWh', system_type: 'hybrid', phase: '1-phase', voltage: null, power_kw: 11.25, battery_kwh: 16, investment_million_vnd: 184.6, production_min_kwh: 900, production_max_kwh: 1200, payback_years: 4.92, payback_label: '4 năm 11 tháng', roof_area_m2: 48.6, is_active: true, display_order: 8 },
  { id: 'h1p-107-16', slug: 'hybrid-10.7kw-1pha-16kwh-v2', name: 'Hy-Brid 10.7 kWp 1pha – 16 kWh', system_type: 'hybrid', phase: '1-phase', voltage: null, power_kw: 10.63, battery_kwh: 16, investment_million_vnd: 189.9, production_min_kwh: 900, production_max_kwh: 1200, payback_years: 5.08, payback_label: '5 năm 1 tháng', roof_area_m2: 45.9, is_active: true, display_order: 9 },
  { id: 'h1p-157-16', slug: 'hybrid-15.7kw-1pha-16kwh', name: 'Hy-Brid 15.7 kWp 1pha – 16 kWh', system_type: 'hybrid', phase: '1-phase', voltage: null, power_kw: 15.63, battery_kwh: 16, investment_million_vnd: 230.8, production_min_kwh: 1200, production_max_kwh: 1500, payback_years: 4.75, payback_label: '4 năm 9 tháng', roof_area_m2: 67.5, is_active: true, display_order: 10 },
  { id: 'h1p-188-16', slug: 'hybrid-18.8kw-1pha-16kwh', name: 'Hy-Brid 18.8 kWp 1pha – 16 kWh', system_type: 'hybrid', phase: '1-phase', voltage: null, power_kw: 18.75, battery_kwh: 16, investment_million_vnd: 261.3, production_min_kwh: 1400, production_max_kwh: 1600, payback_years: 4.83, payback_label: '4 năm 10 tháng', roof_area_m2: 81, is_active: true, display_order: 11 },
  { id: 'h1p-157-32', slug: 'hybrid-15.7kw-1pha-32kwh', name: 'Hy-Brid 15.7 kWp 1pha – 32 kWh', system_type: 'hybrid', phase: '1-phase', voltage: null, power_kw: 15.63, battery_kwh: 32, investment_million_vnd: 293.5, production_min_kwh: 1200, production_max_kwh: 1500, payback_years: 6.08, payback_label: '6 năm 1 tháng', roof_area_m2: 67.5, is_active: true, display_order: 12 },
  { id: 'h1p-244-32', slug: 'hybrid-24.4kw-1pha-32kwh', name: 'Hy-Brid 24.4 kWp 1pha – 32 kWh', system_type: 'hybrid', phase: '1-phase', voltage: null, power_kw: 24.38, battery_kwh: 32, investment_million_vnd: 367.5, production_min_kwh: 2000, production_max_kwh: 2200, payback_years: 4.92, payback_label: '4 năm 11 tháng', roof_area_m2: 105.3, is_active: true, display_order: 13 },
  { id: 'h3lv-107-5', slug: 'hybrid-10.7kw-3pha-at-5kwh', name: 'Hy-Brid 10.7 kWp 3pha AT – 5.12 kWh', system_type: 'hybrid', phase: '3-phase', voltage: 'low', power_kw: 10.63, battery_kwh: 5.12, investment_million_vnd: 177.1, production_min_kwh: 950, production_max_kwh: 1100, payback_years: 4.83, payback_label: '4 năm 10 tháng', roof_area_m2: 45.9, is_active: true, display_order: 14 },
  { id: 'h3lv-107-16', slug: 'hybrid-10.7kw-3pha-at-16kwh', name: 'Hy-Brid 10.7 kWp 3pha AT – 16 kWh', system_type: 'hybrid', phase: '3-phase', voltage: 'low', power_kw: 10.63, battery_kwh: 16, investment_million_vnd: 215.6, production_min_kwh: 900, production_max_kwh: 1200, payback_years: 5.75, payback_label: '5 năm 9 tháng', roof_area_m2: 45.9, is_active: true, display_order: 15 },
  { id: 'h3lv-157-16', slug: 'hybrid-15.7kw-3pha-at-16kwh', name: 'Hy-Brid 15.7 kWp 3pha AT – 16 kWh', system_type: 'hybrid', phase: '3-phase', voltage: 'low', power_kw: 15.63, battery_kwh: 16, investment_million_vnd: 247, production_min_kwh: 1200, production_max_kwh: 1500, payback_years: 5.17, payback_label: '5 năm 2 tháng', roof_area_m2: 67.5, is_active: true, display_order: 16 },
  { id: 'h3lv-244-16', slug: 'hybrid-24.4kw-3pha-at-16kwh', name: 'Hy-Brid 24.4 kWp 3pha AT – 16 kWh', system_type: 'hybrid', phase: '3-phase', voltage: 'low', power_kw: 24.38, battery_kwh: 16, investment_million_vnd: 321.8, production_min_kwh: 1800, production_max_kwh: 2200, payback_years: 4.5, payback_label: '4 năm 6 tháng', roof_area_m2: 105.3, is_active: true, display_order: 17 },
  { id: 'h3hv-157-15', slug: 'hybrid-15.7kw-3pha-ac-15kwh', name: 'Hy-Brid 15.7 kWp 3pha AC – 15.36 kWh', system_type: 'hybrid', phase: '3-phase', voltage: 'high', power_kw: 15.63, battery_kwh: 15.36, investment_million_vnd: 271.7, production_min_kwh: 1200, production_max_kwh: 1500, payback_years: 5.58, payback_label: '5 năm 7 tháng', roof_area_m2: 67.5, is_active: true, display_order: 18 },
  { id: 'h3hv-244-15', slug: 'hybrid-24.4kw-3pha-ac-15kwh', name: 'Hy-Brid 24.4 kWp 3pha AC – 15.36 kWh', system_type: 'hybrid', phase: '3-phase', voltage: 'high', power_kw: 24.38, battery_kwh: 15.36, investment_million_vnd: 345.2, production_min_kwh: 1800, production_max_kwh: 2200, payback_years: 4.83, payback_label: '4 năm 10 tháng', roof_area_m2: 105.3, is_active: true, display_order: 19 },
  { id: 'og1p-5', slug: 'on-grid-5kw-1pha', name: 'On-Grid 5 kWp 1 pha', system_type: 'on-grid', phase: '1-phase', voltage: null, power_kw: 5, investment_million_vnd: 60, production_min_kwh: 350, production_max_kwh: 450, payback_years: 4.25, payback_label: '4 năm 3 tháng', is_active: true, display_order: 20 },
  { id: 'og1p-88', slug: 'on-grid-8.8kw-1pha', name: 'On-Grid 8.8 kWp 1 pha', system_type: 'on-grid', phase: '1-phase', voltage: null, power_kw: 8.75, investment_million_vnd: 95, production_min_kwh: 800, production_max_kwh: 1000, payback_years: 2.92, payback_label: '2 năm 11 tháng', is_active: true, display_order: 21 },
  { id: 'og1p-107', slug: 'on-grid-10.7kw-1pha', name: 'On-Grid 10.7 kWp 1 pha', system_type: 'on-grid', phase: '1-phase', voltage: null, power_kw: 10.63, investment_million_vnd: 110.7, production_min_kwh: 900, production_max_kwh: 1100, payback_years: 3.08, payback_label: '3 năm 1 tháng', is_active: true, display_order: 22 },
  { id: 'og3p-107', slug: 'on-grid-10.7kw-3pha', name: 'On-Grid 10.7 kWp 3 pha', system_type: 'on-grid', phase: '3-phase', voltage: null, power_kw: 10.63, investment_million_vnd: 108.4, production_min_kwh: 800, production_max_kwh: 1000, payback_years: 3.42, payback_label: '3 năm 5 tháng', is_active: true, display_order: 23 },
  { id: 'og3p-157', slug: 'on-grid-15.7kw-3pha', name: 'On-Grid 15.7 kWp 3 pha', system_type: 'on-grid', phase: '3-phase', voltage: null, power_kw: 15.63, investment_million_vnd: 145.8, production_min_kwh: 1100, production_max_kwh: 1300, payback_years: 3.42, payback_label: '3 năm 5 tháng', is_active: true, display_order: 24 },
  { id: 'og3p-188', slug: 'on-grid-18.8kw-3pha', name: 'On-Grid 18.8 kWp 3 pha', system_type: 'on-grid', phase: '3-phase', voltage: null, power_kw: 18.75, investment_million_vnd: 167.2, production_min_kwh: 1200, production_max_kwh: 1400, payback_years: 3.58, payback_label: '3 năm 7 tháng', is_active: true, display_order: 25 },
  { id: 'og3p-294', slug: 'on-grid-29.4kw-3pha', name: 'On-Grid 29.4 kWp 3 pha', system_type: 'on-grid', phase: '3-phase', voltage: null, power_kw: 29.38, investment_million_vnd: 278, production_min_kwh: 2500, production_max_kwh: 3600, payback_years: 2.58, payback_label: '2 năm 7 tháng', is_active: true, display_order: 26 },
  { id: 'og3p-488', slug: 'on-grid-48.8kw-3pha', name: 'On-Grid 48.8 kWp 3 pha', system_type: 'on-grid', phase: '3-phase', voltage: null, power_kw: 48.75, investment_million_vnd: 440.6, production_min_kwh: 4500, production_max_kwh: 6000, payback_years: 2.42, payback_label: '2 năm 5 tháng', is_active: true, display_order: 27 },
  { id: 'og3p-731', slug: 'on-grid-73.1kw-3pha', name: 'On-Grid 73.1 kWp 3 pha', system_type: 'on-grid', phase: '3-phase', voltage: null, power_kw: 73.13, investment_million_vnd: 638.9, production_min_kwh: 6000, production_max_kwh: 9000, payback_years: 2.42, payback_label: '2 năm 5 tháng', is_active: true, display_order: 28 },
  { id: 'og3p-97', slug: 'on-grid-97kw-3pha', name: 'On-Grid 97 kWp 3 pha', system_type: 'on-grid', phase: '3-phase', voltage: null, power_kw: 96.88, investment_million_vnd: 827.5, production_min_kwh: 8000, production_max_kwh: 11800, payback_years: 2.42, payback_label: '2 năm 5 tháng', is_active: true, display_order: 29 },
];

// Create combos directory
const combosDir = path.join(__dirname, '../src/content/combos');
const hybridDir = path.join(combosDir, 'hybrid');
const onGridDir = path.join(combosDir, 'on-grid');

fs.mkdirSync(hybridDir, { recursive: true });
fs.mkdirSync(onGridDir, { recursive: true });

function generateComboMarkdown(combo) {
  const isHybrid = combo.system_type === 'hybrid';
  const phaseLabel = combo.phase === '1-phase' ? '1 Pha' : '3 Pha';
  const voltageLabel = combo.voltage === 'low' ? 'Áp Thấp' : combo.voltage === 'high' ? 'Áp Cao' : '';
  const systemLabel = isHybrid ? 'Hybrid' : 'On-Grid';
  
  const frontmatter = `---
title: "${combo.name}"
slug: "${combo.slug}"
system_type: "${combo.system_type}"
phase: "${combo.phase}"
voltage: ${combo.voltage ? `"${combo.voltage}"` : 'null'}
power_kw: ${combo.power_kw}
${combo.battery_kwh ? `battery_kwh: ${combo.battery_kwh}` : ''}
investment_million_vnd: ${combo.investment_million_vnd}
production_min_kwh: ${combo.production_min_kwh}
production_max_kwh: ${combo.production_max_kwh}
payback_years: ${combo.payback_years}
payback_label: "${combo.payback_label}"
${combo.roof_area_m2 ? `roof_area_m2: ${combo.roof_area_m2}` : ''}
is_active: true
display_order: ${combo.display_order}
---

`;

  const body = `# ${combo.name}

## Thông tin tổng quan

**${combo.name}** là giải pháp điện mặt trời ${systemLabel.toLowerCase()} ${phaseLabel}${voltageLabel ? ` ${voltageLabel}` : ''} 
với công suất **${combo.power_kw} kWp**${isHybrid && combo.battery_kwh ? `, dung lượng lưu trữ **${combo.battery_kwh} kWh**` : ''}.

## Thông số kỹ thuật

### Hệ thống
- **Loại hệ thống:** ${systemLabel}
- **Pha:** ${phaseLabel}
${voltageLabel ? `- **Điện áp:** ${voltageLabel}` : ''}
- **Công suất:** ${combo.power_kw} kWp
${isHybrid && combo.battery_kwh ? `- **Dung lượng pin lưu trữ:** ${combo.battery_kwh} kWh` : ''}

### Hiệu suất
- **Sản lượng điện tối thiểu:** ${combo.production_min_kwh} kWh/tháng
- **Sản lượng điện tối đa:** ${combo.production_max_kwh} kWh/tháng
- **Sản lượng trung bình:** ${Math.round((combo.production_min_kwh + combo.production_max_kwh) / 2)} kWh/tháng

### Đầu tư & Hoàn vốn
- **Chi phí đầu tư:** ${combo.investment_million_vnd} triệu VNĐ
- **Thời gian hoàn vốn:** ${combo.payback_label}
${combo.roof_area_m2 ? `- **Diện tích mái yêu cầu:** ${combo.roof_area_m2} m²` : ''}

## Ưu điểm nổi bật

${isHybrid ? `### ✅ Lưu trữ & Dự phòng
- **Pin lưu trữ:** ${combo.battery_kwh} kWh
- **Khả năng dự phòng:** Có hoạt động khi mất điện
- **Tự chủ năng lượng:** Sử dụng điện mặt trời 24/7
` : `### ✅ Tối ưu chi phí
- **Không cần pin lưu trữ:** Giảm chi phí đầu tư ban đầu
- **Hoàn vốn nhanh:** Thời gian hoàn vốn tối ưu
- **Giảm hóa đơn điện:** Tiết kiệm chi phí điện hàng tháng
`}

### 📊 Hiệu suất cao
- Sản lượng điện: **${combo.production_min_kwh} - ${combo.production_max_kwh} kWh/tháng**
- Phù hợp cho hộ gia đình và doanh nghiệp
- Hiệu suất chuyển đổi vượt trội

### 💰 Tiết kiệm chi phí
- **Chi phí đầu tư:** ${combo.investment_million_vnd} triệu VNĐ
- **Hoàn vốn:** ${combo.payback_label}
- **Tiết kiệm hàng tháng:** ~${Math.round((combo.production_min_kwh + combo.production_max_kwh) / 2 * 2800).toLocaleString('vi-VN')} VNĐ

${combo.roof_area_m2 ? `### 🏗️ Diện tích lắp đặt
- **Yêu cầu:** ${combo.roof_area_m2} m²
- Phù hợp cho mái nhà, mái xưởng, mái văn phòng
- Thiết kế tối ưu không gian
` : ''}

## Ứng dụng phù hợp

${combo.power_kw <= 11 ? `
### 🏠 Hộ gia đình
- Nhà phố, biệt thự
- Hộ gia đình sử dụng điện nhiều
- Muốn tự chủ năng lượng${isHybrid ? ' và có dự phòng khi mất điện' : ''}
` : ''}

${combo.power_kw > 8 && combo.power_kw <= 20 ? `
### 🏢 Văn phòng & Cửa hàng
- Văn phòng công ty
- Cửa hàng, showroom
- Quán café, nhà hàng
- Muốn giảm chi phí điện vận hành
` : ''}

${combo.power_kw > 15 ? `
### 🏭 Nhà xưởng & Công nghiệp
- Nhà xưởng sản xuất
- Kho bãi, logistics
- Khu công nghiệp
- Tiêu thụ điện lớn, muốn tối ưu chi phí
` : ''}

## Thông tin đầu tư

| Hạng mục | Giá trị |
|----------|---------|
| Công suất | ${combo.power_kw} kWp |
${isHybrid && combo.battery_kwh ? `| Pin lưu trữ | ${combo.battery_kwh} kWh |` : ''}
| Sản lượng | ${combo.production_min_kwh} - ${combo.production_max_kwh} kWh/tháng |
| Chi phí đầu tư | ${combo.investment_million_vnd} triệu VNĐ |
| Hoàn vốn | ${combo.payback_label} |
${combo.roof_area_m2 ? `| Diện tích mái | ${combo.roof_area_m2} m² |` : ''}

## Liên hệ tư vấn

Để được tư vấn chi tiết về giải pháp **${combo.name}**, vui lòng liên hệ:

- **Hotline:** 0904 038 448
- **Email:** info@epcvina.com
- **Website:** https://epcvina.com

---

*Lưu ý: Chi phí đầu tư có thể thay đổi tùy theo điều kiện thực tế và vị trí lắp đặt.*
`;

  return frontmatter + body;
}

// Generate markdown files
localCombos.forEach((combo) => {
  const dir = combo.system_type === 'hybrid' ? hybridDir : onGridDir;
  const filename = `${combo.slug}.md`;
  const filepath = path.join(dir, filename);
  
  const markdown = generateComboMarkdown(combo);
  fs.writeFileSync(filepath, markdown, 'utf-8');
  
  console.log(`✓ Created: ${filepath}`);
});

console.log(`\n✅ Generated ${localCombos.length} combo markdown files`);
console.log(`   - Hybrid: ${localCombos.filter((c) => c.system_type === 'hybrid').length} combos`);
console.log(`   - On-Grid: ${localCombos.filter((c) => c.system_type === 'on-grid').length} combos`);
