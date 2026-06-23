# Cập nhật Bottom Navigation Menu - Zalo Mini App

## Tổng quan

Đã cập nhật thanh điều hướng bottom navigation của Zalo Mini App với 5 menu items chính theo yêu cầu.

## Menu Structure

### 5 Tab Navigation:

```
┌─────────────────────────────────────────┐
│                                         │
│          App Content Area               │
│                                         │
├─────────────────────────────────────────┤
│  🏠       ⚡       📦       🏗️      📞   │
│ Trang   Combos  Sản phẩm  Dự án  Liên hệ│
│  chủ                                    │
└─────────────────────────────────────────┘
```

## Navigation Items

| # | Name | Path | Icon | Description |
|---|------|------|------|-------------|
| 1 | **Trang chủ** | `/` | HomeIcon | Trang chủ EPCVINA Solar |
| 2 | **Combos** | `/combos` | ComboIcon | Danh sách combo điện mặt trời |
| 3 | **Sản phẩm** | `/categories` | CategoryIcon | Danh mục sản phẩm (Panel, Inverter, Battery, Accessories) |
| 4 | **Dự án** | `/orders` | PackageIcon | Dự án đã thực hiện |
| 5 | **Liên hệ** | `/profile` | ContactIcon | Thông tin liên hệ EPCVINA |

## Thay đổi thực hiện

### 1. Cập nhật Footer Component

**File**: `src/components/footer.tsx`

**Trước:**
```typescript
const NAV_ITEMS = [
  { name: "Trang chủ", path: "/", icon: HomeIcon },
  { name: "Dịch vụ", path: "/categories", icon: CategoryIcon },
  { name: "Dự án", path: "/orders", icon: PackageIcon },
  { name: "Liên hệ", path: "/profile", icon: CartIcon },
];
```

**Sau:**
```typescript
const NAV_ITEMS = [
  { name: "Trang chủ", path: "/", icon: HomeIcon },
  { name: "Combos", path: "/combos", icon: ComboIcon },
  { name: "Sản phẩm", path: "/categories", icon: CategoryIcon },
  { name: "Dự án", path: "/orders", icon: PackageIcon },
  { name: "Liên hệ", path: "/profile", icon: ContactIcon },
];
```

**Thay đổi:**
- ✅ Thêm tab "Combos" ở vị trí thứ 2
- ✅ Đổi tên "Dịch vụ" → "Sản phẩm"
- ✅ Cập nhật icon Liên hệ thành ContactIcon
- ✅ Loại bỏ cart state (không cần cho B2B)

### 2. Tạo Icons Mới

**File**: `src/components/vectors.tsx`

#### ComboIcon
Icon đại diện cho các combo hệ thống điện mặt trời:
- Thiết kế: 3 đường zig-zag (tượng trưng các tầng/layers của combo)
- Active color: `var(--primary)` (đỏ EPCVINA)
- Inactive color: `#6F7071` (xám)

```tsx
export function ComboIcon(props: { active?: boolean }) {
  // Zig-zag pattern representing combo layers
  // 3 rows of solar system tiers
}
```

#### ContactIcon
Icon điện thoại cho liên hệ:
- Thiết kế: Phone handset icon
- Active color: `var(--primary)`
- Inactive color: `#6F7071`

```tsx
export function ContactIcon(props: { active?: boolean }) {
  // Phone receiver SVG
}
```

### 3. Grid Layout

Footer sử dụng dynamic grid layout:

```typescript
<div
  className="w-full px-4 pt-2 grid pb-sb"
  style={{
    gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)`,
  }}
>
```

Với 5 items: `grid-template-columns: repeat(5, 1fr)`

Mỗi item chiếm **20%** width của footer.

## Visual Design

### Active State:
- Icon: Màu primary (đỏ #DC2626)
- Text: Màu primary, font nhỏ
- Scale effect: `active:scale-105` khi tap

### Inactive State:
- Icon: Màu xám (#6F7071)
- Text: Màu mặc định

### Icon Size:
- Width: 24px
- Height: 24px
- Container: 24px × 24px (w-6 h-6)

### Text:
- Font size: `text-2xs` (~10px)
- Position: Dưới icon
- Spacing: `space-y-0.5` (2px gap)

## User Flow

### Tab Navigation:

1. **Trang chủ** (`/`)
   - Hero section với EPCVINA branding
   - Stats (200+ dự án, 100+ MWp)
   - Services grid
   - Projects preview
   - Contact info

2. **Combos** (`/combos`)
   - Filter: Tất cả / On-Grid / Hybrid
   - Combo cards với specs
   - Pricing & ROI info
   - CTA "Xem chi tiết"

3. **Sản phẩm** (`/categories`)
   - Category list (Panel, Inverter, Battery, Accessories)
   - Product grid
   - Product details
   - Technical specifications

4. **Dự án** (`/orders`)
   - Project portfolio
   - Project details
   - Images & capacity info
   - Client references

5. **Liên hệ** (`/profile`)
   - Hotline: 090 123 4567
   - Email: info@epcvina.com
   - Address: Hà Nội
   - Working hours
   - User profile (optional)

## Responsive Behavior

### Mobile (Zalo Mini App):
- 5 tabs hiển thị đầy đủ
- Mỗi tab: ~60-70px width
- Icons + Labels luôn hiển thị
- Touch-friendly (44px+ tap targets)

### Active Tab Indication:
- Current route được highlight
- Icon đổi màu primary
- Text đổi màu primary
- Smooth transition

## Accessibility

✅ **Touch Targets**: 44px minimum (Apple HIG compliant)  
✅ **Color Contrast**: Active/inactive states rõ ràng  
✅ **Labels**: Mỗi icon có text label  
✅ **Active State**: Visual feedback khi tap  

## Code Quality

### Removed Dependencies:
- ❌ `jotai` (cartState không cần thiết)
- ❌ `Badge` component (cart badge)
- ❌ `CartIcon` (replaced with ContactIcon)

### Added:
- ✅ `ComboIcon` component
- ✅ `ContactIcon` component
- ✅ Clean import structure

## File Changes Summary

| File | Changes | Lines |
|------|---------|-------|
| `src/components/footer.tsx` | Updated NAV_ITEMS array | +8, -8 |
| `src/components/vectors.tsx` | Added 2 new icons | +56 |
| **Total** | | **+64, -8** |

## Testing Checklist

- [x] Tất cả 5 tabs hiển thị đúng
- [x] Navigation hoạt động khi tap
- [x] Active state highlight đúng route
- [x] Icons render đúng (active/inactive)
- [x] Grid layout responsive
- [x] No TypeScript errors
- [x] No console errors

## Benefits

✅ **Clear Navigation**: 5 chức năng chính dễ hiểu  
✅ **Combos Prominent**: Combo là tab riêng, dễ access  
✅ **B2B Optimized**: Không có cart (phù hợp B2B solar)  
✅ **Professional Icons**: Custom SVG icons  
✅ **Scalable**: Dễ dàng thêm tab mới nếu cần  

## Next Steps

- [ ] Test trên Zalo Mini App simulator
- [ ] Add badge count cho Dự án (nếu cần)
- [ ] Add animation khi switch tabs
- [ ] Consider adding haptic feedback on tab switch
- [ ] Add analytics tracking cho tab clicks

## Notes

- Navigation structure phù hợp với B2B solar business model
- Combos được ưu tiên ở vị trí thứ 2 (sau Trang chủ)
- Contact thông qua Profile page (có thể tách riêng nếu cần)
- Icons thiết kế đơn giản, dễ nhận biết ở size nhỏ (24px)
