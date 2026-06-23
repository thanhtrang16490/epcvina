# Bổ sung Combo Điện Mặt Trời cho Zalo Mini App

## Tổng quan

Đã đồng bộ hóa dữ liệu combo từ `epcvinasolar` sang `epcvinaminiapp` với đầy đủ thông tin On-Grid và Hybrid systems.

## Thay đổi thực hiện

### 1. Tạo file dữ liệu Combo

**File mới**: `src/data/combos.ts`

Chứa 8 combo mẫu từ epcvinasolar:

#### On-Grid Combos (4 systems):
1. **On-Grid 5 kWp 1 pha** - 60 triệu, hoàn vốn 4.25 năm
2. **On-Grid 8.8 kWp 1 pha** - 105 triệu, hoàn vốn 4.5 năm  
3. **On-Grid 10.7 kWp 3 pha** - 128 triệu, hoàn vốn 4 năm
4. **On-Grid 15.7 kWp 3 pha** - 188 triệu, hoàn vốn 3.75 năm

#### Hybrid Combos (4 systems):
1. **Hybrid 10.7 kWp 1 pha – 5.12 kWh** - 155 triệu
2. **Hybrid 10.7 kWp 1 pha – 10.24 kWh** - 174.5 triệu
3. **Hybrid 10.7 kWp 3 pha – 5.12 kWh** - 165 triệu
4. **Hybrid 10.7 kWp 3 pha – 16 kWh** - 215 triệu

### 2. Cấu trúc dữ liệu Combo

```typescript
interface MiniCombo {
  id: number;
  title: string;
  slug: string;
  system_type: 'on-grid' | 'hybrid';
  phase: '1-phase' | '3-phase';
  power_kw: number;              // Công suất kWp
  battery_kwh?: number;          // Dung lượng pin (Hybrid only)
  investment_million_vnd: number; // Chi phí đầu tư
  production_min_kwh: number;    // Sản lượng tối thiểu
  production_max_kwh: number;    // Sản lượng tối đa
  payback_years: number;         // Thời gian hoàn vốn
  payback_label: string;         // Label tiếng Việt
  roof_area_m2?: number;         // Diện tích mái
  description: string;
  features: string[];
  image: string;
}
```

### 3. Tạo Combo List Page

**File mới**: `src/pages/combos/index.tsx`

Tính năng:
- ✅ Filter tabs: Tất cả / On-Grid / Hybrid
- ✅ Hiển thị danh sách combo dạng card
- ✅ Stats summary EPCVINA (200+ dự án, 25 năm BH, ...)
- ✅ Header gradient đỏ với back button
- ✅ Responsive mobile-first design

**Giao diện:**
```
┌─────────────────────────────────┐
│ ← Combo Điện Mặt Trời           │
│   Giải pháp trọn gói            │
│                                 │
│ [Tất cả] [On-Grid] [Hybrid]    │
├─────────────────────────────────┤
│ ┌───────────────────────────┐   │
│ │   [HYBRID] [3 PHA]        │   │
│ │   Combo Image             │   │
│ ├───────────────────────────┤   │
│ │ Hybrid 10.7 kWp 1 pha     │   │
│ │ ☀️ 10.7 kWp  ⚡ 900-1200 │   │
│ │ 🔋 10.24 kWh  ⏱️ 4n 8t   │   │
│ │                           │   │
│ │ ✓ Pin lưu trữ 10.24 kWh   │   │
│ │ ✓ Dự phòng dài            │   │
│ │ ✓ Sản lượng 900-1200      │   │
│ │                           │   │
│ │ 174.5 triệu  [Xem chi tiết]│   │
│ └───────────────────────────┘   │
│                                 │
│ Tại sao chọn EPCVINA?           │
│ 200+     25 năm    70-90%      │
│ Dự án    BH         Tiết kiệm   │
└─────────────────────────────────┘
```

### 4. Tạo Combo Card Component

**File mới**: `src/components/combo-card.tsx`

Hiển thị mỗi combo với:
- ✅ Image với badges (HYBRID/ON-GRID, 1 PHA/3 PHA)
- ✅ 4 key specs với icons:
  - ☀️ Công suất (kWp)
  - ⚡ Sản lượng (kWh/tháng)
  - 🔋 Pin lưu trữ (Hybrid only)
  - ⏱️ Thời gian hoàn vốn
- ✅ 3 features nổi bật
- ✅ Giá đầu tư (triệu VNĐ)
- ✅ Button "Xem chi tiết"

**Color Coding:**
- On-Grid: Blue badge (#2563EB)
- Hybrid: Green badge (#16A34A)
- Phase: Red badge (#DC2626)

### 5. Cập nhật Router

**File**: `src/router.tsx`

Thêm route mới:
```typescript
{
  path: "/combos",
  element: <ComboListPage />,
  handle: {
    title: "Combo Điện Mặt Trời",
  },
}
```

### 6. Cập nhật Home Services

**File**: `src/pages/home/services.tsx`

Tất cả 4 service cards đều link đến `/combos`:
- On-Grid → /combos
- Hybrid → /combos
- BESS → /combos
- EV Charger → /combos

## Cấu trúc file

```
epcvinaminiapp/src/
├── data/
│   ├── products.ts              # Sản phẩm (8 items)
│   └── combos.ts                # ⭐ NEW - Combo (8 items)
├── pages/
│   ├── home/
│   │   └── services.tsx         # ⭐ UPDATED - Link to /combos
│   └── combos/
│       └── index.tsx            # ⭐ NEW - Combo list page
├── components/
│   └── combo-card.tsx           # ⭐ NEW - Combo card UI
└── router.tsx                   # ⭐ UPDATED - Added /combos route
```

## Dữ liệu chi tiết

### On-Grid Systems

| Power | Phase | Investment | Production | Payback |
|-------|-------|------------|------------|---------|
| 5 kWp | 1P | 60M | 350-450 kWh | 4.25y |
| 8.8 kWp | 1P | 105M | 600-750 kWh | 4.5y |
| 10.7 kWp | 3P | 128M | 900-1100 kWh | 4y |
| 15.7 kWp | 3P | 188M | 1300-1600 kWh | 3.75y |

### Hybrid Systems

| Power | Battery | Phase | Investment | Production | Payback |
|-------|---------|-------|------------|------------|---------|
| 10.7 kWp | 5.12 kWh | 1P | 155M | 900-1200 kWh | 4.5y |
| 10.7 kWp | 10.24 kWh | 1P | 174.5M | 900-1200 kWh | 4.67y |
| 10.7 kWp | 5.12 kWh | 3P | 165M | 900-1200 kWh | 4.5y |
| 10.7 kWp | 16 kWh | 3P | 215M | 900-1200 kWh | 5y |

## Số liệu từ epcvinasolar

- **Total combos in epcvinasolar**: 29 combos
  - On-Grid: ~11 combos
  - Hybrid: ~18 combos
- **Synced to mini app**: 8 combos (4 On-Grid + 4 Hybrid)
- **Coverage**: Representative samples from each category

## Tính năng nổi bật

### ✅ Filter System
- Tất cả: Hiển thị cả 8 combos
- On-Grid: Chỉ 4 On-Grid systems
- Hybrid: Chỉ 4 Hybrid systems

### ✅ Visual Indicators
- Badge màu cho system type
- Badge màu cho phase type
- Icons cho từng spec type
- Color-coded specs

### ✅ Mobile Optimized
- Card-based layout
- Touch-friendly buttons
- Readable fonts
- Proper spacing

### ✅ Information Density
- Key specs visible at a glance
- Top 3 features shown
- Clear pricing
- CTA button prominent

## Để thêm thêm combos

1. Mở file `src/data/combos.ts`
2. Thêm combo mới vào `onGridCombos` hoặc `hybridCombos`:

```typescript
{
  id: 9,
  title: "On-Grid 20 kWp 3 pha",
  slug: "on-grid-20kw-3pha",
  system_type: "on-grid",
  phase: "3-phase",
  power_kw: 20,
  investment_million_vnd: 240,
  production_min_kwh: 1700,
  production_max_kwh: 2000,
  payback_years: 3.5,
  payback_label: "3 năm 6 tháng",
  description: "Mô tả combo",
  features: [
    "Feature 1",
    "Feature 2",
    "Feature 3",
  ],
  image: "https://via.placeholder.com/800x600/...",
}
```

## Lợi ích

✅ **Synced với epcvinasolar** - Cùng dữ liệu combo  
✅ **Filter thông minh** - On-Grid vs Hybrid  
✅ **UI chuyên nghiệp** - Card-based design  
✅ **Mobile-first** - Tối ưu cho Zalo Mini App  
✅ **Dễ mở rộng** - Thêm combo dễ dàng  
✅ **Không cần API** - Local data  

## Next Steps

- [ ] Thêm đầy đủ 29 combos từ epcvinasolar
- [ ] Tạo Combo Detail Page (`/combos/:slug`)
- [ ] Thêm chức năng gọi tư vấn từ combo
- [ ] Thêm chức năng gửi yêu cầu báo giá
- [ ] Thay placeholder images bằng ảnh thật
- [ ] Thêm so sánh combo (comparison feature)
- [ ] Thêm tính toán ROI chi tiết

## Ghi chú

- Combo data extract từ `/epcvinasolar/src/content/combos/**/*.md`
- Mỗi system type có 4 combos mẫu
- Payback years calculated từ investment và production
- Tất cả combos có `is_active: true` từ source
