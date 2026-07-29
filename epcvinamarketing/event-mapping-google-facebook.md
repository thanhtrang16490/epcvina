# Event Mapping - Google Ads & Facebook

**Website gốc:** `epcvinasolar`  
**Mục tiêu:** map event trong code sang conversion dùng cho ads

---

## 1. Mục tiêu chính

| Event trong code | Nguồn bắn | Dùng cho | Ghi chú |
|---|---|---|---|
| `lead_submit` | Form landing page | Google Ads conversion, báo cáo lead | Conversion chính |
| `hotline_click` | Hero section | Google Ads conversion, remarketing audience | Conversion chính |
| `nav_hotline_click` | Micro navigation | Google Ads conversion | Tín hiệu nóng |
| `nav_cta_click` | Micro navigation | Google Ads conversion | Tín hiệu quan tâm |
| `hero_calculator_click` | Hero section | Google Ads micro-conversion | Tín hiệu bắt đầu tính toán |
| `hero_sample_calculator_click` | Hero section | Google Ads micro-conversion | Tín hiệu xem mẫu |
| `why_epcvina_call_click` | Section năng lực | Google Ads conversion | Tín hiệu tin tưởng |
| `why_epcvina_survey_click` | Section năng lực | Google Ads conversion | Tín hiệu chốt khảo sát |
| `faq_hotline_click` | FAQ section | Google Ads conversion | Tín hiệu nóng cuối phễu |
| `faq_survey_click` | FAQ section | Google Ads conversion | Tín hiệu nóng cuối phễu |
| `mini_calculator_completed` | Calculator section | Google Ads micro-conversion | Người đã tính xong |
| `landing_inline_lead_submitted` | Calculator section | Google Ads conversion | Conversion rất quan trọng |
| `bill_case_calculator_click` | BeforeAfterBills section | Google Ads micro-conversion | Người quan tâm case thực tế |
| `exit_popup_submit` | Exit intent popup | Google Ads conversion | Lead cuối phễu |
| `exit_popup_hotline` | Exit intent popup | Google Ads conversion | Lead cuối phễu |
| `nav_zalo_click` | Micro navigation | Theo dõi nội bộ | Không ưu tiên làm conversion ads chính |

---

## 2. Gợi ý conversion cho Google Ads

### Primary conversions
- `lead_submit`
- `hotline_click`
- `landing_inline_lead_submitted`
- `exit_popup_submit`
- `exit_popup_hotline`

### Secondary conversions
- `nav_hotline_click`
- `nav_cta_click`
- `why_epcvina_call_click`
- `why_epcvina_survey_click`
- `faq_hotline_click`
- `faq_survey_click`
- `bill_case_calculator_click`

### Micro conversions
- `hero_calculator_click`
- `hero_sample_calculator_click`
- `mini_calculator_completed`

---

## 3. Gợi ý dùng cho Facebook remarketing

Facebook hiện nên dùng cho remarketing sau Google, nên ưu tiên audience theo hành vi:

- Người đã vào `/dien-mat-troi-gia-dinh`
- Người đã vào `/calculator`
- Người đã bấm `hotline_click`
- Người đã bấm `lead_submit`
- Người đã bấm `landing_inline_lead_submitted`
- Người đã bấm `exit_popup_submit`
- Người đã bấm `exit_popup_hotline`

Nếu cần tối ưu thêm:

- Nhóm 7 ngày: ưu tiên `hotline_click`, `lead_submit`
- Nhóm 30 ngày: ưu tiên `mini_calculator_completed`, `hero_calculator_click`, `bill_case_calculator_click`
- Nhóm 90 ngày: ưu tiên toàn bộ visitor site

---

## 4. Lưu ý kỹ thuật

- Các event đang phát ra qua `window.gtag('event', ...)`.
- Nếu bật GTM hoặc Meta Pixel sau này, nên map lại cùng tên event để tránh lệch báo cáo.
- `nav_zalo_click` chỉ nên theo dõi nội bộ ở giai đoạn này vì Zalo chưa phải kênh ads chính.
