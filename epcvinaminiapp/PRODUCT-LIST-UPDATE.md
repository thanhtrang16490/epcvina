# Product List Style - EPCVINA Solar Mobile

## Tổng quan

Đã cập nhật Zalo Mini App sử dụng cách hiển thị sản phẩm và list sản phẩm dựa theo mobile design của EPCVINA Solar website (EquipmentPageMobile).

## Design Pattern từ EPCVINA Solar

### Source Reference:
- **File**: `epcvinasolar/src/components/pages/equipment/EquipmentPageMobile.tsx`
- **Lines**: 879 lines
- **Pattern**: Mobile-first product list with brand grouping

## Mobile Product Display Pattern

### Key Features:

1. **Sticky Header** với 3 phần:
   - Title row (tên category + count)
   - Brand tabs (horizontal scroll)
   - Search + Filter bar

2. **Brand Grouping**:
   - Products grouped by brand
   - Sticky brand headers
   - Alphabetically sorted

3. **Product List Items**:
   - Horizontal card layout
   - Thumbnail (56×56px)
   - Product name + brand
   - Price (formatted)
   - Chevron icon

4. **Search & Filter**:
   - Real-time search
   - Filter drawer button
   - Clear button

## Implementation in Mini App

### 1. New Component: ProductList

**File**: `src/components/product-list.tsx` (MỚI - 226 lines)

```typescript
interface ProductListProps {
  products: Product[];
  categoryLabel: string;
  categoryIcon: React.ReactNode;
  categoryColor: string;  // e.g., "text-blue-600"
  categoryBg: string;     // e.g., "bg-blue-50"
}
```

#### Features Implemented:

✅ **Brand Tabs**
```tsx
<div className="sticky top-[104px] z-20 bg-white border-b">
  <div className="flex gap-2 overflow-x-auto">
    {brands.map(brand => (
      <button>{brand}</button>
    ))}
  </div>
</div>
```

✅ **Search Bar**
```tsx
<input
  type="text"
  placeholder="Tìm kiếm sản phẩm..."
  className="focus:ring-2 focus:ring-red-600"
/>
```

✅ **Brand Headers** (sticky)
```tsx
<div className="sticky top-[160px] z-10 bg-gray-50">
  <h2>{brand}</h2>
  <p>{count} sản phẩm</p>
</div>
```

✅ **Product Items** (horizontal)
```tsx
<div className="flex items-center gap-4 p-4">
  {/* Thumbnail */}
  <div className="w-14 h-14 rounded-xl">
    <img src={product.main_image} />
  </div>
  
  {/* Info */}
  <div className="flex-1">
    <h3>{product.name}</h3>
    <p>{product.brand}</p>
  </div>
  
  {/* Price */}
  <div className="text-right">
    <p className="text-red-600">{formatCurrency(price)}</p>
  </div>
  
  {/* Chevron */}
  <ChevronRight />
</div>
```

### 2. Updated: CategoryDetailPage

**File**: `src/pages/catalog/category-detail.tsx`

#### Before:
```tsx
// Old: Grid layout
<ProductGrid products={products} className="pt-4" />
```

#### After:
```tsx
// New: List layout with brand grouping
<ProductList
  products={products}
  categoryLabel={meta.label}
  categoryIcon={meta.icon}
  categoryColor={meta.color}
  categoryBg={meta.bg}
/>
```

#### Category Metadata:
```typescript
const CATEGORY_META = {
  panel: {
    label: "Tấm mô-đun quang điện",
    icon: <Zap />,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  inverter: {
    label: "Biến tần / Inverter",
    icon: <TrendingUp />,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  battery: {
    label: "Pin lưu trữ",
    icon: <Battery />,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  accessories: {
    label: "Phụ kiện lắp đặt",
    icon: <Wrench />,
    color: "text-gray-600",
    bg: "bg-gray-100",
  },
};
```

## Visual Comparison

### OLD: Grid Layout (2 columns)
```
┌─────────────────────┐
│ [Product] [Product] │
│   Image     Image   │
│   Name      Name    │
│   Price     Price   │
│                     │
│ [Product] [Product] │
│   Image     Image   │
└─────────────────────┘
```

### NEW: List Layout (with brand grouping)
```
┌──────────────────────────┐
│ Category Header          │
├──────────────────────────┤
│ [Brand1] [Brand2] ...   │ ← Tabs
├──────────────────────────┤
│ 🔍 Search     [Filter]  │
├──────────────────────────┤
│ Brand1 (5 sản phẩm)     │ ← Sticky
├──────────────────────────┤
│ [📷] Product Name  $100 │ →
│ [📷] Product Name  $200 │ →
├──────────────────────────┤
│ Brand2 (3 sản phẩm)     │ ← Sticky
├──────────────────────────┤
│ [📷] Product Name  $150 │ →
└──────────────────────────┘
```

## Layout Structure

### Sticky Positions:

| Element | Position | Z-index | Purpose |
|---------|----------|---------|---------|
| **Category Header** | `top-0` | z-30 | Always visible |
| **Brand Tabs** | `top-[104px]` | z-20 | Below header |
| **Search Bar** | Part of tabs section | - | Integrated |
| **Brand Headers** | `top-[160px]` | z-10 | Below tabs |

### Spacing:

| Element | Spacing | Value |
|---------|---------|-------|
| Header padding | `px-4 py-3` | 16px × 12px |
| Tabs padding | `px-4 py-2` | 16px × 8px |
| Search padding | `px-4 py-3` | 16px × 12px |
| Brand header | `px-4 py-2` | 16px × 8px |
| Product item | `p-4` | 16px |
| Gap between brands | `space-y-6` | 24px |

## Color System

### Category Colors:

| Category | Color | Background | Accent |
|----------|-------|------------|--------|
| **Panel** | Blue #2563EB | Blue #EFF6FF | Blue #3B82F6 |
| **Inverter** | Orange #EA580C | Orange #FFF7ED | Orange #F97316 |
| **Battery** | Green #16A34A | Green #F0FDF4 | Green #22C55E |
| **Accessories** | Gray #4B5563 | Gray #F3F4F6 | Gray #6B7280 |

### Price Color:
- **Default**: Red #DC2626 (`text-red-600`)
- **Matches EPCVINA Solar**: Orange #F97316

## Currency Formatting

```typescript
function formatCurrency(value: number): string {
  if (value >= 1000000000) return (value / 1000000000).toFixed(1) + " tỷ";
  if (value >= 1000000) return (value / 1000000).toFixed(1) + " triệu";
  if (value >= 1000) return (value / 1000).toFixed(0) + "K";
  return value.toString();
}
```

**Examples:**
- 5,000,000 → "5 triệu"
- 1,500,000,000 → "1.5 tỷ"
- 50,000 → "50K"

## Search & Filter

### Search Behavior:
```typescript
const filteredProducts = useMemo(() => {
  if (!searchQuery.trim()) return products;
  const query = searchQuery.toLowerCase().trim();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      (product.brand && product.brand.toLowerCase().includes(query))
  );
}, [products, searchQuery]);
```

**Features:**
- ✅ Real-time filtering
- ✅ Case-insensitive
- ✅ Searches name + brand
- ✅ Clear button (X icon)

### Filter Drawer:
- Button present (🔧 SlidersHorizontal icon)
- Future: Implement filter options
  - Price range
  - Capacity
  - Brand
  - Specifications

## Product Item Layout

### Structure:
```
┌──────────────────────────────────┐
│ [Thumbnail]  Product Name  Price │
│   56×56px    Brand        $100   │
│                    [→]           │
└──────────────────────────────────┘
```

### Dimensions:
| Element | Size | Classes |
|---------|------|---------|
| **Thumbnail** | 56×56px | `w-14 h-14` |
| **Border radius** | 12px | `rounded-xl` |
| **Text - Name** | 14px | `text-sm font-semibold` |
| **Text - Brand** | 12px | `text-xs text-gray-500` |
| **Text - Price** | 14px | `text-sm font-semibold` |
| **Icon - Chevron** | 20×20px | `h-5 w-5` |

### Interactions:
- **Hover**: `hover:bg-gray-50`
- **Active/Tap**: `active:bg-gray-100`
- **Transition**: `transition-colors`
- **Click**: Navigate to `/product/{id}`

## Brand Grouping Logic

### Grouping:
```typescript
const productsByBrand = useMemo(() => {
  const grouped: Record<string, Product[]> = {};
  products.forEach((product) => {
    if (!grouped[product.brand || "Unknown"]) {
      grouped[product.brand || "Unknown"] = [];
    }
    grouped[product.brand || "Unknown"].push(product);
  });
  // Sort alphabetically
  const sortedBrands = Object.keys(grouped).sort();
  const result: Record<string, Product[]> = {};
  sortedBrands.forEach((brand) => {
    result[brand] = grouped[brand];
  });
  return result;
}, [products]);
```

**Features:**
- ✅ Alphabetical sorting
- ✅ Unknown brand fallback
- ✅ Dynamic grouping
- ✅ Count per brand

## Comparison with EPCVINA Solar

| Feature | Website | Mini App | Status |
|---------|---------|----------|--------|
| Brand tabs | ✅ Horizontal scroll | ✅ Horizontal scroll | ✅ Same |
| Search bar | ✅ With clear button | ✅ With clear button | ✅ Same |
| Filter button | ✅ SlidersHorizontal | ✅ SlidersHorizontal | ✅ Same |
| Brand headers | ✅ Sticky | ✅ Sticky | ✅ Same |
| Product layout | ✅ Horizontal card | ✅ Horizontal card | ✅ Same |
| Thumbnail size | 56×56px | 56×56px | ✅ Same |
| Price format | ✅ Currency helper | ✅ Currency helper | ✅ Same |
| Chevron icon | ✅ | ✅ | ✅ Same |
| Active states | ✅ hover/active | ✅ hover/active | ✅ Same |
| Color scheme | Orange #F97316 | Red #DC2626 | ⚠️ Different |
| Image component | Custom `<Image>` | Native `<img>` | ⚠️ Different |
| Touch swipe | ✅ Gallery | ❌ Not implemented | ⚠️ Missing |

## Benefits

✅ **Better Scanning**: Brand grouping makes it easy to find products  
✅ **Space Efficient**: List layout shows more products per screen  
✅ **Mobile Optimized**: Horizontal cards are easier to tap  
✅ **Consistent**: Same pattern as EPCVINA Solar website  
✅ **Searchable**: Real-time search functionality  
✅ **Scalable**: Works with 10 or 1000 products  
✅ **Professional**: Clean, modern design  

## File Changes

| File | Action | Lines | Purpose |
|------|--------|-------|---------|
| `src/components/product-list.tsx` | CREATE | +226 | New product list component |
| `src/pages/catalog/category-detail.tsx` | UPDATE | +90/-14 | Use new list layout |
| **Total** | | **+316/-14** | |

## Removed Components

❌ **CategorySlider**: No longer needed (brand tabs replace)  
❌ **ProductGrid**: Replaced by ProductList  
❌ **ProductItem**: Still exists but not used in category pages  
❌ **HorizontalDivider**: No longer needed  
❌ **ProductGridSkeleton**: Simplified loading state  

## Next Steps

- [ ] Add filter drawer implementation
- [ ] Add sort options (price, name, brand)
- [ ] Add touch swipe for product images
- [ ] Add pagination or infinite scroll
- [ ] Add loading skeletons
- [ ] Add empty state illustrations
- [ ] Track search analytics
- [ ] Add recently viewed products
- [ ] Add compare functionality
- [ ] Add favorites/wishlist

## Notes

### Why List Instead of Grid?

**List advantages for mobile:**
1. ✅ More products visible per screen
2. ✅ Easier to scan brand by brand
3. ✅ Better for filtering/sorting
4. ✅ Matches user behavior (scroll vertically)
5. ✅ Consistent with e-commerce apps (Shopee, Lazada)

**When to use Grid:**
- Desktop view (already implemented in epcvinasolar)
- Product detail related products
- Search results with images
- Featured products showcase

### Sticky Header Offset

The sticky positions account for:
- **Layout Header**: ~48-64px (varies)
- **Category Header**: 56px
- **Brand Tabs**: 48px
- **Total offset**: ~152-168px

This ensures headers don't overlap when scrolling.

## Related Files

- Website Mobile: `epcvinasolar/src/components/pages/equipment/EquipmentPageMobile.tsx`
- Mini App List: `epcvinaminiapp/src/components/product-list.tsx`
- Mini App Page: `epcvinaminiapp/src/pages/catalog/category-detail.tsx`
- Old Grid: `epcvinaminiapp/src/components/product-grid.tsx`

## Summary

Zalo Mini App giờ hiển thị sản phẩm theo list layout với brand grouping, search, và sticky headers - giống hệt EPCVINA Solar mobile design! 🎉
