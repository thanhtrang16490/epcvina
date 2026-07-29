# fbq Component Recommendations

**Website gốc:** `epcvinasolar`  
**Mục tiêu:** đề xuất chỗ nên bắn Meta Pixel events nếu team bật Meta Pixel thật để cuối cùng có khách chat Zalo, gọi điện hoặc điền form lead lấy thông tin tư vấn

---

## 1. Layout chung

### [DashboardLayout.astro](/Users/thanhtrang/Documents/epcvina.com/epcvinasolar/src/layouts/DashboardLayout.astro)
- Gắn `fbq('track', 'PageView')` ở layout chung.
- Đây là nơi phù hợp nhất để cài Pixel base code.
- Nếu mở rộng sau này, có thể thêm event chuẩn theo route để biết user vào trang nào.

## 2. Hero section

### [HeroSection.tsx](/Users/thanhtrang/Documents/epcvina.com/epcvinasolar/src/components/pages/ad-landing/HeroSection.tsx)
Nên bắn:
- `ViewContent` khi section hero hiển thị lần đầu
- `Lead` hoặc custom event khi bấm:
  - `hero_calculator_click`
  - `hotline_click`
  - `hero_sample_calculator_click`

## 3. Micro navigation

### [MicroNavigation.tsx](/Users/thanhtrang/Documents/epcvina.com/epcvinasolar/src/components/pages/ad-landing/MicroNavigation.tsx)
Nên bắn:
- `Contact` hoặc custom event cho:
  - `nav_hotline_click`
  - `nav_cta_click`
- `nav_zalo_click` chỉ nên track nội bộ, không cần ưu tiên làm conversion chính

## 4. Calculator section

### [CalculatorSection.tsx](/Users/thanhtrang/Documents/epcvina.com/epcvinasolar/src/components/pages/ad-landing/CalculatorSection.tsx)
Nên bắn:
- `Lead` hoặc custom event khi:
  - `mini_calculator_completed`
  - `landing_inline_lead_submitted`
- Có thể thêm `ViewContent` khi kết quả calculator hiện ra

## 5. Social proof / case study

### [BeforeAfterBillsSection.tsx](/Users/thanhtrang/Documents/epcvina.com/epcvinasolar/src/components/pages/ad-landing/BeforeAfterBillsSection.tsx)
Nên bắn:
- `ViewContent` khi section case study được xem
- `AddToWishlist` hoặc custom engagement event khi bấm:
  - `bill_case_calculator_click`

## 6. FAQ section

### [FAQSection.tsx](/Users/thanhtrang/Documents/epcvina.com/epcvinasolar/src/components/pages/ad-landing/FAQSection.tsx)
Nên bắn:
- `Lead` hoặc `Contact` cho:
  - `faq_survey_click`
  - `faq_hotline_click`

## 7. Exit popup

### [ExitIntentPopup.tsx](/Users/thanhtrang/Documents/epcvina.com/epcvinasolar/src/components/pages/ad-landing/ExitIntentPopup.tsx)
Nên bắn:
- `Lead` cho `exit_popup_submit`
- `Contact` cho `exit_popup_hotline`

---

## 8. Khuyến nghị cách làm

- Nếu dùng Meta Pixel thật, nên giữ `PageView` ở layout chung.
- Chỉ map các event conversion quan trọng sang Meta Ads:
  - `lead_submit`
  - `hotline_click`
  - `landing_inline_lead_submitted`
  - `exit_popup_submit`
  - `exit_popup_hotline`
- Các event còn lại nên để phục vụ audience/remarketing, không cần đẩy hết vào conversion chính.
