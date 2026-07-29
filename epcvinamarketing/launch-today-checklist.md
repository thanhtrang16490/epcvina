# Checklist Launch Hôm Nay

**Website gốc:** `epcvinasolar`  
**Mục tiêu:** đủ điều kiện bật ads ngay hôm nay để tạo ra khách chat Zalo, gọi điện hoặc điền form lead lấy thông tin tư vấn

## 1. Tracking tối thiểu

- [ ] GA4 đang ghi nhận pageview trên toàn site.
- [ ] `lead_submit` bắn khi gửi form.
- [ ] `hotline_click` bắn khi bấm số điện thoại.
- [ ] `landing_inline_lead_submitted` bắn trong calculator.
- [ ] `exit_popup_submit` bắn khi popup gửi form.
- [ ] `exit_popup_hotline` bắn khi bấm hotline trong popup.
- [ ] `bill_case_calculator_click` bắn khi bấm từ case study sang calculator.
- [ ] `nav_hotline_click` và `nav_cta_click` bắn đúng trên thanh điều hướng.

## 2. Trang cần test

- [ ] Trang chủ `/`
- [ ] Trang `/calculator`
- [ ] Trang `/dien-mat-troi-gia-dinh`

Mỗi trang phải:

- [ ] Load đúng.
- [ ] CTA dễ bấm trên mobile.
- [ ] Hotline bấm được.
- [ ] Form gửi được.
- [ ] Event lên GA4 đúng.

## 3. Ads cần sẵn

- [ ] Google Brand Search
- [ ] Google Search - Điện mặt trời gia đình
- [ ] Google Search - Chi phí / hoàn vốn
- [ ] Facebook Remarketing 7 ngày
- [ ] Facebook Remarketing 30 ngày
- [ ] Facebook Remarketing 90 ngày

## 4. UTM và đối soát

- [ ] URL ads đã gắn UTM.
- [ ] UTM đi qua form / CRM.
- [ ] Có sheet đối soát lead.
- [ ] Có người nhận lead và phản hồi trong 5-15 phút.

## 5. Nếu còn thiếu thì chưa bật ngân sách lớn

- [ ] Nếu GA4 chưa ổn thì dừng.
- [ ] Nếu form lỗi thì dừng.
- [ ] Nếu CTA không bắn event thì dừng.
- [ ] Nếu lead chưa về đúng người thì dừng.
