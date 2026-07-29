# Checklist Tracking Trước Khi Chạy Ads

**Website gốc:** `epcvinasolar`  
**Mục tiêu:** đảm bảo đo lường đầy đủ trước khi bật Google Ads và Facebook Remarketing để cuối cùng có khách chat Zalo, gọi điện hoặc điền form lead lấy thông tin tư vấn

---

## 1. Tài khoản và quyền truy cập

- [ ] Có quyền admin Google Ads.
- [ ] Có quyền admin Google Analytics 4.
- [ ] Có quyền truy cập chỉnh sửa website.
- [ ] Có tài khoản email nhận lead và cảnh báo hệ thống.

---

## 2. Công cụ đo lường cần có

- [ ] GA4 đã gắn trên toàn bộ website.
- [ ] Nếu có dùng GTM thì GTM đã được cài đúng và hoạt động trên mọi trang.
- [ ] Google Ads conversion tracking đã có hoặc đã map từ GA4.
- [ ] Có cơ chế lưu UTM khi người dùng đi từ quảng cáo vào form.

---

## 3. Sự kiện chuyển đổi trong code

Kiểm tra các event đang có trong `epcvinasolar`:

- [ ] `lead_submit`
- [ ] `hotline_click`
- [ ] `nav_hotline_click`
- [ ] `nav_cta_click`
- [ ] `hero_calculator_click`
- [ ] `hero_sample_calculator_click`
- [ ] `why_epcvina_call_click`
- [ ] `why_epcvina_survey_click`
- [ ] `faq_hotline_click`
- [ ] `faq_survey_click`
- [ ] `mini_calculator_completed`
- [ ] `landing_inline_lead_submitted`
- [ ] `bill_case_calculator_click`
- [ ] `exit_popup_submit`
- [ ] `exit_popup_hotline`
- [ ] `nav_zalo_click` chỉ theo dõi nội bộ, không ưu tiên làm conversion ads chính

---

## 4. Test từng landing page

Kiểm tra cả 3 trang:

- [ ] Trang chủ `/`
- [ ] Trang calculator `/calculator`
- [ ] Trang điện mặt trời gia đình `/dien-mat-troi-gia-dinh`

Với mỗi trang, cần xác nhận:

- [ ] Trang tải đúng.
- [ ] CTA chính dễ bấm.
- [ ] Form gửi thành công.
- [ ] Click số điện thoại hoạt động trên mobile.
- [ ] Event chuyển đổi được bắn lên GA4.
- [ ] Có tín hiệu hoàn tất form hoặc thông báo thành công.

---

## 5. Kiểm tra UTM

- [ ] Có gắn UTM cho mọi URL quảng cáo.
- [ ] UTM giữ đúng khi chuyển trang.
- [ ] UTM hiển thị trong form hoặc CRM.
- [ ] Có thể đối soát được lead theo campaign / ad group / ad.

Mẫu UTM gợi ý:

```text
utm_source=google&utm_medium=cpc&utm_campaign=solar_family_hanoi&utm_content=rsa1&utm_term=lắp điện mặt trời gia đình
```

---

## 6. Kiểm tra form và hậu kiểm lead

- [ ] Form có xác nhận thành công sau khi gửi.
- [ ] Lead được gửi về email hoặc CRM.
- [ ] Có sheet theo dõi lead theo ngày.
- [ ] Có người phụ trách phản hồi lead trong 5-15 phút để xử lý chat Zalo, gọi điện hoặc form lead.

---

## 7. Kiểm tra trước khi launch

- [ ] Kiểm tra conversion trong chế độ preview của GTM nếu có dùng.
- [ ] Kiểm tra click call trên mobile.
- [ ] Kiểm tra form submit bằng ít nhất 1 thiết bị desktop và 1 thiết bị mobile.
- [ ] Kiểm tra báo cáo real-time trong GA4.
- [ ] Chốt danh sách từ khóa phủ định trong Google Ads.
- [ ] Chốt danh sách khu vực target chỉ gồm Hà Nội và tỉnh lân cận.

---

## 8. Kiểm tra sau launch 24-48 giờ

- [ ] Có impression trên Google Ads.
- [ ] Có click vào landing page.
- [ ] Có conversion được ghi nhận.
- [ ] CTR không quá thấp ở nhóm từ khóa chính.
- [ ] Không có keyword chạy sai intent.
- [ ] Remarketing audience đã bắt đầu tích lũy dữ liệu.

---

## 9. Người chịu trách nhiệm

- [ ] Thiết lập tracking: kỹ thuật
- [ ] Kiểm tra lead về: marketing / sales
- [ ] Đối soát số liệu: marketing
- [ ] Tối ưu sự kiện: kỹ thuật + marketing

---

## 10. Ghi chú

- Nên ưu tiên đo `lead_submit`, `hotline_click` và `landing_inline_lead_submitted` trước.
- Nếu tài nguyên hạn chế, tạm bỏ các event phụ như `nav_zalo_click`.
- Chỉ launch ads khi test đủ cả 3 landing page và event chuyển đổi đã ghi nhận chính xác.
