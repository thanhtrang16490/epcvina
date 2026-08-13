# EPCVINA Hub-Cluster Link Map

Mục tiêu của bản đồ này là giữ mỗi cụm nội dung có một hub rõ ràng, các cluster đi sâu đúng intent, và mọi trang chuyển đổi đều dẫn về đúng điểm chốt.

## 1. Hub chính

- `/` -> hub thương hiệu tổng
- `/solar-home` -> hub giải pháp cho gia đình
- `/solar-home/he-thong` -> hub danh mục combo on-grid + hybrid
- `/solar-cong-nghiep` -> hub điện mặt trời công nghiệp
- `/hybrid-bess` -> hub hybrid + BESS
- `/sac-ev` -> hub sạc xe điện
- `/bao-gia` -> hub báo giá
- `/calculator` -> hub công cụ tính toán
- `/tin-tuc` -> hub nội dung biên tập
- `/hoi-dap` -> hub FAQ
- `/doi-tac` -> hub authority đối tác
- `/thiet-bi` -> hub thiết bị

## 2. Luồng internal link đề xuất

### Trang chủ
- Link xuống `/solar-home`
- Link xuống `/solar-cong-nghiep`
- Link xuống `/hybrid-bess`
- Link xuống `/sac-ev`
- Link xuống `/calculator`
- Link xuống `/bao-gia`
- Link xuống `/tin-tuc`
- Link xuống `/doi-tac`

### Solar Home
- `/solar-home` -> `/solar-home/he-thong`, `/solar-home/on-grid`, `/solar-home/hybrid`
- `/solar-home` -> các landing intent: `/dien-mat-troi-gia-dinh`, `/dien-mat-troi-nha-pho`, `/dien-mat-troi-biet-thu`
- `/solar-home` -> CTA mạnh về `/calculator` và `/bao-gia`

### Hybrid + BESS
- `/hybrid-bess` -> `/bao-gia-pin-luu-tru`, `/calculator/pin-luu-tru`
- `/hybrid-bess` -> `/dien-mat-troi-co-luu-tru`
- `/hybrid-bess` -> `/solar-home/hybrid`
- `/hybrid-bess/[slug]` -> về hub `/hybrid-bess`

### Solar C&I
- `/solar-cong-nghiep` -> `/ung-dung/dien-cong-nghiep`
- `/solar-cong-nghiep` -> các landing tỉnh: `/dien-mat-troi-bac-ninh`, `/dien-mat-troi-hung-yen`, `/dien-mat-troi-hai-duong`, `/dien-mat-troi-hai-phong`, `/dien-mat-troi-quang-ninh`, `/dien-mat-troi-thai-nguyen`, `/dien-mat-troi-vinh-phuc`
- `/solar-cong-nghiep` -> `/calculator` và `/bao-gia`

### Báo giá
- `/bao-gia` -> `/bao-gia-dien-mat-troi`, `/bao-gia-pin-luu-tru`, `/bao-gia-sac-xe-dien`
- mọi landing dịch vụ -> CTA về `/bao-gia` và `/calculator`

### Calculator
- `/calculator` -> 5 công cụ con
- mỗi công cụ con -> CTA về `/bao-gia` hoặc `/lien-he`
- bài blog/FAQ/province -> dẫn về `/calculator` khi có intent so sánh chi phí

### Tin tức / Kiến thức / FAQ
- `/tin-tuc` -> bài viết chuyên sâu + CTA sang `/calculator`
- `/kien-thuc` -> hub nền tảng, dẫn sang `/hoi-dap` và `/tin-tuc`
- `/hoi-dap` -> dẫn sang `/bao-gia`, `/calculator`, `/lien-he`

### Thiết bị / Đối tác
- `/thiet-bi` -> product detail và category
- `/doi-tac` -> brand detail pages
- product detail -> link ngược về `/doi-tac` và `/thiet-bi`

## 3. Điểm chốt chuyển đổi

- CTA đầu tiên: `/calculator`
- CTA chốt: `/bao-gia`
- CTA hỗ trợ: `/lien-he`
- CTA authority: `/doi-tac`, `/du-an`, `/chung-nhan`

## 4. Quy tắc triển khai

- Hub chỉ nên có một intent chính.
- Cluster phải link về hub của mình và không cạnh tranh cùng từ khóa.
- Landing tỉnh chỉ nên nhắm local intent.
- Trang nội bộ/noindex không dùng để kéo search traffic.

