# Checklist Tracking 1 Trang

**Website gốc:** `epcvinasolar`  
**Mục tiêu:** kiểm tra đủ tracking trước khi chạy ads để cuối cùng có khách chat Zalo, gọi điện hoặc điền form lead lấy thông tin tư vấn

## Trước khi launch

- [ ] Có quyền admin Google Ads.
- [ ] Có quyền admin GA4.
- [ ] GA4 đã gắn toàn site.
- [ ] Nếu có dùng GTM thì GTM hoạt động trên mọi trang.
- [ ] Nếu có dùng Meta Pixel thì Pixel đã cài và nhận pageview.
- [ ] Google Ads conversion tracking đã có hoặc đã map từ GA4.
- [ ] Có UTM cho mọi URL quảng cáo.
- [ ] Có event `lead_submit`.
- [ ] Có event `hotline_click`.
- [ ] Có event `hero_calculator_click`.
- [ ] Có event `hero_sample_calculator_click`.
- [ ] Có event `why_epcvina_call_click`.
- [ ] Có event `why_epcvina_survey_click`.
- [ ] Có event `faq_hotline_click`.
- [ ] Có event `faq_survey_click`.
- [ ] Kiểm tra cả 3 trang:
  - [ ] `/`
  - [ ] `/calculator`
  - [ ] `/dien-mat-troi-gia-dinh`
- [ ] Form gửi thành công.
- [ ] Click số điện thoại hoạt động trên mobile.
- [ ] Event lên GA4 đúng.
- [ ] Có thank-you page hoặc tín hiệu hoàn tất form.
- [ ] Lead về email hoặc CRM để xử lý chat Zalo, gọi điện hoặc form lead.
- [ ] Có sheet đối soát lead theo ngày.
- [ ] Đã chốt keyword phủ định.
- [ ] Đã chốt target khu vực: Hà Nội + tỉnh lân cận.

## Sau khi launch 24-48h

- [ ] Có impression.
- [ ] Có click vào landing page.
- [ ] Có conversion ghi nhận.
- [ ] CTR nhóm chính không quá thấp.
- [ ] Không có keyword sai intent.
- [ ] Remarketing audience đã bắt đầu tích lũy.

## Ưu tiên tối thiểu

- [ ] Đo `lead_submit` trước.
- [ ] Đo `hotline_click` trước.
- [ ] Nếu thiếu thời gian, bỏ bớt event phụ như `scroll_75`.
