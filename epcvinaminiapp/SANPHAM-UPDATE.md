# Cập nhật sản phẩm Zalo Mini App từ EPCVINA Solar

## Tổng quan

Đã đồng bộ hóa dữ liệu sản phẩm từ `epcvinasolar` sang `epcvinaminiapp` để hiển thị trong Zalo Mini App.

## Thay đổi thực hiện

### 1. Tạo file dữ liệu sản phẩm local

**File mới**: `src/data/products.ts`

Chứa toàn bộ thông tin sản phẩm từ epcvinasolar:
- ✅ 8 sản phẩm mẫu đại diện cho 4 danh mục
- ✅ Thông tin chi tiết: tên, thương hiệu, model, mô tả
- ✅ Thông số kỹ thuật (specifications)
- ✅ Tính năng nổi bật (features)
- ✅ Chế độ bảo hành

### 2. Cấu trúc sản phẩm

#### Danh mục sản phẩm (Categories):
1. **Tấm pin mặt trời** (Panel)
2. **Inverter** (Biến tần)
3. **Pin lưu trữ** (Battery)
4. **Phụ kiện** (Accessories)

#### Sản phẩm mẫu:

**Tấm pin mặt trời:**
- Aiko 680W Stellar 2N 66-231 (Hiệu suất 25.2%, N-Type ABC)
- JA Solar 580W Bifacial (PERC, 22.3% hiệu suất)

**Inverter:**
- Huawei SUN2000-100KTL-M2 (100KW, 3 pha, 98.8% hiệu suất)
- Deye SUN-8K-SG04LP3-EU (8KW Hybrid, 3 pha)

**Pin lưu trữ:**
- Huawei LUNA2000-15-S0 (15kWh, LiFePO4, 10 năm BH)
- Deye SE-G5.1-Pro-LV (5.12kWh, Low Voltage)

**Phụ kiện:**
- Cáp điện DC Leader 4mm²
- Đầu nối MC4 Leader 1500V

### 3. Cập nhật State Management

**File**: `src/state.ts`

```typescript
// Trước: Lấy từ API
export const productsState = atom(async (get) => {
  const products = await requestWithFallback("/products", []);
  return products;
});

// Sau: Lấy từ local data
export const productsState = atom(async (get) => {
  const categories = await get(categoriesState);
  return localProducts.map((product) => ({
    ...product,
    categoryId: categories.find(...)?.id || 1,
    category: categories.find(...)!,
    price: product.price || 0,
  }));
});
```

### 4. Cập nhật Types

**File**: `src/types.d.ts`

Thêm các fields mới cho Product interface:
```typescript
export interface Product {
  id: number;
  name: string;
  brand: string;           // Mới
  category: Category;
  categoryId: number;      // Mới
  model: string;           // Mới
  description: string;     // Mới
  price: number;
  main_image: string;      // Mới
  specifications?: Record<string, string>;  // Mới
  features?: string[];                      // Mới
  warranty?: string;                        // Mới
}
```

### 5. Tối ưu Product Item Component

**File**: `src/components/product-item.tsx`

Thay đổi:
- ❌ Bỏ chức năng giỏ hàng (không phù hợp B2B)
- ✅ Hiển thị thương hiệu sản phẩm
- ✅ Hiển thị thông số kỹ thuật chính (Công suất, Hiệu suất)
- ✅ Hiển thị chế độ bảo hành
- ✅ UI sạch sẽ, chuyên nghiệp hơn
- ✅ Placeholder image nếu không có ảnh

**Giao diện mới:**
```
┌─────────────────┐
│   Product Image │
│                 │
├─────────────────┤
│ AIKO            │ ← Brand
│ Tấm pin Aiko... │ ← Name
│                 │
│ Công suất: 680W │ ← Spec
│ Hiệu suất: 25%  │ ← Spec
│                 │
│ 🛡️ 15 năm       │ ← Warranty
└─────────────────┘
```

### 6. Banners

**Cập nhật**: `src/state.ts` - `bannersState`

```typescript
export const bannersState = atom<string[]>([
  "https://via.placeholder.com/800x400/DC2626/FFFFFF?text=EPCVINA+Solar",
  "https://via.placeholder.com/800x400/B91C1C/FFFFFF?text=Tiet+kiem+70-90%25+dien",
  "https://via.placeholder.com/800x400/991B1B/FFFFFF?text=Bao+hanh+25+năm",
]);
```

## Cấu trúc dữ liệu

```
epcvinaminiapp/
├── src/
│   ├── data/
│   │   └── products.ts          # ⭐ Dữ liệu sản phẩm local
│   ├── state.ts                 # ⭐ Cập nhật dùng local data
│   ├── types.d.ts               # ⭐ Thêm fields mới
│   └── components/
│       └── product-item.tsx     # ⭐ UI mới cho solar products
```

## Số lượng sản phẩm

- **Total**: 28 products trong epcvinasolar
- **Synced**: 8 products mẫu (đại diện 4 categories)
- **Categories**: 4 (Panel, Inverter, Battery, Accessories)

## Để thêm thêm sản phẩm

1. Mở file `src/data/products.ts`
2. Thêm sản phẩm mới vào mảng `products`:
```typescript
{
  id: 9,
  name: "Tên sản phẩm",
  brand: "Thương hiệu",
  category: "panel|inverter|battery|accessories",
  model: "Model",
  description: "Mô tả",
  main_image: "/path/to/image.png",
  specifications: {
    "Thông số 1": "Giá trị 1",
    "Thông số 2": "Giá trị 2",
  },
  features: ["Tính năng 1", "Tính năng 2"],
  warranty: "Chế độ bảo hành",
}
```

## Lợi ích

✅ **Không cần API server** - Chạy offline hoàn toàn
✅ **Đồng bộ với epcvinasolar** - Cùng dữ liệu sản phẩm
✅ **Dễ bảo trì** - Thêm/sửa sản phẩm trong 1 file
✅ **Performance tốt** - Không cần network request
✅ **UI phù hợp B2B** - Tập trung vào thông tin kỹ thuật

##下一步

- [ ] Thêm đầy đủ 28 sản phẩm từ epcvinasolar
- [ ] Thay thế placeholder images bằng ảnh thật
- [ ] Thêm chức năng gọi điện tư vấn từ product detail
- [ ] Thêm chức năng gửi yêu cầu báo giá
- [ ] Tích hợp Zalo Chat cho từng sản phẩm

## Ghi chú

- Product data được extract từ `/epcvinasolar/src/content/products/**/*.md`
- Mỗi category có 2 sản phẩm mẫu
- Có thể mở rộng dễ dàng bằng cách thêm vào mảng `products`
