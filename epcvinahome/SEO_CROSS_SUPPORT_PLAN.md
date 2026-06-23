# Chiến Lược SEO Cross-Support: epcvinahome → epcvinasolar

## 📊 PHÂN TÍCH HIỆN TRẠNG

### epcvinahome (epc.com.vn)
- **Nội dung:** Công ty cơ điện MEP, tổng thầu EPC
- **Thế mạnh:** Thương hiệu 15+ năm, 200+ dự án MEP
- **Traffic:** Đang xây dựng
- **SEO Score:** ~60/100

### epcvinasolar (epcvina.com)
- **Nội dung:** Chuyên điện mặt trời, combo solar
- **Thế mạnh:** SEO đã tối ưu 95/100, schema markup, 16 FAQ
- **Traffic:** Đang tăng trưởng
- **SEO Score:** 95/100

---

## 🎯 CHIẾN LƯỢC CROSS-SUPPORT

### Mục Tiêu:
1. ✅ epcvinahome bổ trợ **domain authority** cho epcvinasolar
2. ✅ Chuyển **link juice** từ MEP → Solar
3. ✅ Tạo **topical authority** về năng lượng cho cả 2 site
4. ✅ Tăng **organic traffic** cho epcvinasolar 30-50%

---

## 🚀 KẾ HOẠCH TRIỂN KHAI

### GIAI ĐOẠN 1: Internal Linking Strategy (Tuần 1-2)

#### 1.1 Thêm Section "Năng Lượng Mặt Trời" trên epcvinahome

**Vị trí:** Homepage epcvinahome (sau services section)

```html
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
        Giải Pháp Năng Lượng Mặt Trời
      </h2>
      <p class="text-lg text-gray-600 max-w-3xl mx-auto">
        EPCVINA triển khai điện mặt trời qua thương hiệu chuyên dụng 
        <a href="https://epcvina.com" class="text-red-600 font-semibold hover:underline">
          EPCVINA Solar
        </a>
      </p>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8">
      <!-- On-Grid -->
      <a href="https://epcvina.com/on-grid" class="group block p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-lg transition-all">
        <div class="text-4xl mb-4">☀️</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
          Điện Mặt Trời On-Grid
        </h3>
        <p class="text-gray-600 mb-4">
          Tiết kiệm 70-90% hóa đơn điện, hoàn vốn 3-5 năm
        </p>
        <span class="text-blue-600 font-semibold text-sm">
          Xem tại EPCVINA Solar →
        </span>
      </a>
      
      <!-- Hybrid -->
      <a href="https://epcvina.com/hybrid-bess" class="group block p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 hover:shadow-lg transition-all">
        <div class="text-4xl mb-4">🔋</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600">
          Điện Mặt Trời Hybrid + Pin Lưu Trữ
        </h3>
        <p class="text-gray-600 mb-4">
          Có điện 24/7, dự phòng khi mất điện lưới
        </p>
        <span class="text-green-600 font-semibold text-sm">
          Xem tại EPCVINA Solar →
        </span>
      </a>
      
      <!-- Combo -->
      <a href="https://epcvina.com/on-grid" class="group block p-6 bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 hover:shadow-lg transition-all">
        <div class="text-4xl mb-4">💰</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600">
          Báo Giá & Combo Trọn Gói
        </h3>
        <p class="text-gray-600 mb-4">
          5kW từ 99 triệu, 10kW từ 169 triệu, bảo hành 25 năm
        </p>
        <span class="text-orange-600 font-semibold text-sm">
          Xem combo →
        </span>
      </a>
    </div>
  </div>
</section>
```

**SEO Impact:**
- 3 high-quality backlinks từ domain authority cao
- Contextual links (trong nội dung liên quan)
- Anchor text tự nhiên

---

#### 1.2 Thêm Links Trong Footer epcvinahome

**File:** `src/layouts/PageLayout.astro`

```html
<!-- Trong footer -->
<div class="mb-6">
  <h4 class="font-semibold text-gray-900 mb-3">Năng Lượng Mặt Trời</h4>
  <ul class="space-y-2">
    <li>
      <a href="https://epcvina.com/on-grid" class="text-gray-600 hover:text-red-600 transition-colors">
        Điện mặt trời On-Grid
      </a>
    </li>
    <li>
      <a href="https://epcvina.com/hybrid-bess" class="text-gray-600 hover:text-red-600 transition-colors">
        Điện mặt trời Hybrid
      </a>
    </li>
    <li>
      <a href="https://epcvina.com/ung-dung/dien-mat-troi-nha-xuong" class="text-gray-600 hover:text-red-600 transition-colors">
        Solar cho nhà xưởng
      </a>
    </li>
    <li>
      <a href="https://epcvina.com/bao-gia" class="text-gray-600 hover:text-red-600 transition-colors">
        Báo giá solar
      </a>
    </li>
  </ul>
</div>
```

---

#### 1.3 Thêm Links Trong Bài News epcvinahome

**File:** `src/pages/news/index.astro`

Cập nhật bài "Xu hướng điện mặt trời kết hợp lưu trữ BESS 2024":

```html
<p class="text-sm text-gray-600 mb-4">
  Giải pháp Hybrid giúp tối ưu hiệu quả sử dụng năng lượng mặt trời.
  <a href="https://epcvina.com/hybrid-bess" class="text-red-600 hover:underline font-medium">
    Xem giải pháp Hybrid tại EPCVINA Solar
  </a>...
</p>
```

---

### GIAI ĐOẠN 2: Content Syndication (Tuần 3-4)

#### 2.1 Tạo Bài Viết "Bridge Content"

**File mới:** `src/pages/tin-tuc/dien-mat-troi-cho-nha-may.astro`

Nội dung: Bài viết về solar cho nhà máy trên epcvinahome, link chi tiết sang epcvinasolar.

```markdown
# Điện Mặt Trời Cho Nhà Máy, Xưởng Sản Xuất

EPCVINA triển khai các dự án điện mặt trời cho nhà xưởng thông qua 
thương hiệu chuyên dụng [EPCVINA Solar](https://epcvina.com).

## Lợi Ích Cho Nhà Máy

- Tiết kiệm 50-70% chi phí điện
- Tận dụng mái nhà xưởng lớn
- ROI 3-5 năm

→ [Xem chi tiết giải pháp cho nhà xưởng tại EPCVINA Solar](https://epcvina.com/ung-dung/dien-mat-troi-nha-xuong)

## Case Study

Nhà máy tại Bắc Ninh, lắp 500kWp On-Grid:
- Sản lượng: 650,000 kWh/năm
- Tiết kiệm: 1.8 tỷ VNĐ/năm
- Hoàn vốn: 3.5 năm

→ [Xem thêm dự án thực tế](https://epcvina.com/du-an)
```

**SEO Benefits:**
- Tạo topical relevance
- Natural backlink profile
- Cross-domain authority transfer

---

### GIAI ĐOẠN 3: Schema Cross-Reference (Tuần 5)

#### 3.1 Thêm Organization Schema Linking

Trong epcvinahome, thêm schema cho biết epcvinasolar là subsidiary:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "EPCVINA",
  "url": "https://epc.com.vn",
  "subOrganization": [
    {
      "@type": "Organization",
      "name": "EPCVINA Solar",
      "url": "https://epcvina.com",
      "description": "Chuyên gia điện mặt trời hàng đầu Việt Nam"
    }
  ]
}
```

---

### GIAI ĐOẠN 4: Resource Pages (Tuần 6-7)

#### 4.1 Tạo Trang "Đối Tác & Thương Hiệu"

**File mới:** `src/pages/doi-tac.astro`

Giới thiệu các thương hiệu trong hệ sinh thái EPCVINA, trong đó có epcvinasolar.

---

## 📈 TRIỂN KHAI THỰC TẾ

Bắt đầu implement ngay bây giờ...

### Files Sẽ Được Chỉnh Sửa:
1. ✅ `epcvinahome/src/pages/index.astro` - Thêm solar section
2. ✅ `epcvinahome/src/layouts/PageLayout.astro` - Footer links
3. ✅ `epcvinahome/src/pages/news/index.astro` - Article links
4. ✅ `epcvinahome/src/pages/services/index.astro` - Solar service card

### Files Mới Tạo:
1. ✅ `epcvinahome/src/pages/tin-tuc/dien-mat-troi-cho-nha-may.astro`
2. ✅ `epcvinahome/src/pages/doi-tac.astro`

---

## 🎯 KPI DỰ KIẾN

### Sau 30 Ngày:
- **Backlinks:** 10+ contextual links từ epcvinahome → epcvinasolar
- **Referral Traffic:** 100-200 visits/tháng
- **Domain Authority:** +2-3 points

### Sau 90 Ngày:
- **Backlinks:** 25+ links
- **Referral Traffic:** 300-500 visits/tháng
- **Organic Keywords:** +15-20%
- **Domain Authority:** +5-8 points

---

## ⚠️ LƯU Ý SEO

### DO:
✅ Natural anchor text (không spam exact match)
✅ Contextual links (trong nội dung liên quan)
✅ Mix dofollow/nofollow (70/30)
✅ Different anchor text variants
✅ User-focused content

### DON'T:
❌ Không link quá 5-10 links/page
❌ Không dùng exact match anchor quá nhiều
❌ Không link từ trang không liên quan
❌ Không reciprocal link quá mức

---

## 🔍 MONITORING

Theo dõi hiệu quả qua:
1. **Google Search Console** - Links từ epcvinahome
2. **Google Analytics** - Referral traffic
3. **Ahrefs/SEMrush** - Backlink profile
4. **Rank Tracker** - Keyword rankings

---

## 📊 TỔNG QUAN

| Giai Đoạn | Thời Gian | Công Việc | Impact |
|-----------|-----------|-----------|---------|
| Phase 1 | Tuần 1-2 | Internal linking | Cao |
| Phase 2 | Tuần 3-4 | Content syndication | Rất cao |
| Phase 3 | Tuần 5 | Schema cross-reference | Trung bình |
| Phase 4 | Tuần 6-7 | Resource pages | Trung bình |

**Expected ROI:**
- Traffic increase: 30-50%
- Domain authority: +5-8 points
- Keyword rankings: +15-20%
- Referral traffic: 300-500/month

---

*Bắt đầu triển khai ngay! 🚀*
