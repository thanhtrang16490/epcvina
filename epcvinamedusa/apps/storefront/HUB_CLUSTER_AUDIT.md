# EPCVINA Hub-Cluster Audit

Tình trạng hiện tại của site đã tốt về kỹ thuật SEO/GEO. Điểm cần giữ là cấu trúc nội dung không bị dàn trải, và mỗi cụm có một hub rõ ràng.

## 1. Hub giữ vai trò chính

- `/`  
  Trang thương hiệu tổng, dẫn vào các cụm lớn.
- `/solar-home`  
  Hub gia đình, nên là trang bán giải pháp cho hộ gia đình.
- `/solar-home/he-thong`  
  Hub catalog combo, phù hợp để dẫn vào từng combo con.
- `/solar-cong-nghiep`  
  Hub C&I, nên giữ vai trò landing doanh nghiệp.
- `/hybrid-bess`  
  Hub hybrid/BESS, tập trung backup, lưu trữ, ESS.
- `/sac-ev`  
  Hub EV charger.
- `/bao-gia`  
  Hub chốt lead giá.
- `/calculator`  
  Hub công cụ tính.
- `/tin-tuc`  
  Hub nội dung biên tập.
- `/hoi-dap`  
  Hub FAQ authority.
- `/doi-tac`  
  Hub authority brand/partner.
- `/thiet-bi`  
  Hub sản phẩm thiết bị.

## 2. Cluster nên giữ đúng vai

### Gia đình
- `/dien-mat-troi-gia-dinh`
- `/dien-mat-troi-nha-pho`
- `/dien-mat-troi-biet-thu`
- `/solar-home/on-grid`
- `/solar-home/hybrid`
- `/solar-home/he-thong/[slug]`
- `/giai-phap-thi-cong-mai-bang`
- `/giai-phap-thi-cong-mai-ngoi`
- `/giai-phap-thi-cong-mai-ton`
- `/dien-mat-troi-co-luu-tru`
- `/dien-mat-troi-ket-hop-sac-xe-dien`

### Công nghiệp
- `/solar-cong-nghiep`
- `/ung-dung/dien-cong-nghiep`
- `/dien-mat-troi-bac-ninh`
- `/dien-mat-troi-hung-yen`
- `/dien-mat-troi-hai-duong`
- `/dien-mat-troi-hai-phong`
- `/dien-mat-troi-quang-ninh`
- `/dien-mat-troi-thai-nguyen`
- `/dien-mat-troi-vinh-phuc`

### Hybrid / BESS
- `/hybrid-bess`
- `/hybrid-bess/[slug]`
- `/he-thong-pin-luu-tru-bess`
- `/dien-mat-troi-hybrid`
- `/bao-gia-pin-luu-tru`
- `/calculator/pin-luu-tru`

### EV
- `/sac-ev`
- `/sac-xe-dien-tai-nha`
- `/bao-gia-sac-xe-dien`
- `/calculator/sac-xe-dien`

### Báo giá và tính toán
- `/bao-gia`
- `/bao-gia-dien-mat-troi`
- `/calculator`
- `/calculator/chi-phi-dau-tu`
- `/calculator/san-luong-dien`
- `/calculator/thoi-gian-hoan-von`

### Kiến thức và tin tức
- `/tin-tuc`
- `/tin-tuc/[slug]`
- `/kien-thuc`
- `/hoi-dap`

## 3. Trang nên giữ noindex

- `/dang-nhap`
- `/ung-dung/epcvina-app`
- `/projects`
- các route kỹ thuật hoặc redirect helper

## 4. Ưu tiên tiếp theo

1. Giữ hub `/solar-home`, `/solar-cong-nghiep`, `/hybrid-bess`, `/bao-gia`, `/calculator` làm điểm điều hướng chính.
2. Cho cluster liên kết ngược về hub thay vì tự cạnh tranh.
3. Dùng `/tin-tuc` và `/hoi-dap` để tăng citability, không để chúng lệch sang sales quá mạnh.
4. Tiếp tục giữ đồng bộ brand `EPCVINA Solar` ở các trang public-facing.

