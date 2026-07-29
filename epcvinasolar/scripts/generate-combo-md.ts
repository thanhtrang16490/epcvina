import type { LocalCombo } from '../src/data/combos';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import combos data dynamically
async function run() {
  const { localCombos } = await import('../src/data/combos.js');

  // Create combos directory
  const combosDir = path.join(process.cwd(), 'src/content/combos');
  const hybridDir = path.join(combosDir, 'hybrid');
  const onGridDir = path.join(combosDir, 'on-grid');

  // Create directories
  fs.mkdirSync(hybridDir, { recursive: true });
  fs.mkdirSync(onGridDir, { recursive: true });

  function generateComboMarkdown(combo: any) {
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
- **Diện tích mái yêu cầu:** ${combo.roof_area_m2 || 'N/A'} m²

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

### 🏗️ Diện tích lắp đặt
- **Yêu cầu:** ${combo.roof_area_m2 || 'N/A'} m²
- Phù hợp cho mái nhà, mái xưởng, mái văn phòng
- Thiết kế tối ưu không gian

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
| Diện tích mái | ${combo.roof_area_m2 || 'N/A'} m² |

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
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
