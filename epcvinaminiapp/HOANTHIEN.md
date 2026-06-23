# EPCVINA Zalo Mini App - Hoàn thiện

## Tổng quan

Ứng dụng Zalo Mini App cho EPCVINA Solar đã được hoàn thiện dựa trên cấu trúc của `epcvinasolar`.

## Thay đổi chính

### 1. Cấu hình ứng dụng (`app-config.json`)
- ✅ Tên ứng dụng: "EPCVINA Solar"
- ✅ Màu header: #DC2626 (đỏ EPCVINA)
- ✅ Logo: EPCVINA Solar
- ✅ Địa chỉ: Hà Nội, Việt Nam

### 2. Thanh điều hướng (Footer)
- ✅ Trang chủ
- ✅ Dịch vụ (On-Grid, Hybrid, BESS, EV Charger)
- ✅ Dự án
- ✅ Liên hệ

### 3. Trang chủ mới
Đã tạo các component mới:

#### HeroSection (`hero.tsx`)
- Banner gradient đỏ với thương hiệu EPCVINA
- Nút gọi tư vấn nhanh
- Thông tin nổi bật: Tư vấn miễn phí, bảo hành 25 năm, tiết kiệm 70-90%

#### Stats (`stats.tsx`)
- 200+ Dự án
- 100+ MWp công suất
- 10+ Năm kinh nghiệm
- 25 Năm bảo hành

#### Services (`services.tsx`)
- On-Grid: Hệ thống hòa lưới
- Hybrid: Hệ thống lưu trữ pin
- BESS: Pin quy mô lớn
- EV Charger: Trạm sạc xe điện

#### Projects (`projects.tsx`)
- Nhà máy Samsung SEVT - Thái Nguyên (5 MWp)
- Khu đô thị Vinhomes - Hà Nội (3 MWp)
- Lotte Mart Dong Da - Hà Nội (2 MWp)

#### Contact (`contact.tsx`)
- Hotline: 090 123 4567
- Email: info@epcvina.com
- Địa chỉ: Hà Nội, Việt Nam
- Giờ làm việc: T2-T7, 8:00 - 17:30

## Cấu trúc thư mục

```
epcvinaminiapp/
├── src/
│   ├── pages/
│   │   └── home/
│   │       ├── index.tsx          # Trang chủ chính
│   │       ├── hero.tsx           # Banner hero
│   │       ├── stats.tsx          # Thống kê
│   │       ├── services.tsx       # Dịch vụ
│   │       ├── projects.tsx       # Dự án
│   │       └── contact.tsx        # Liên hệ
│   ├── components/
│   │   ├── footer.tsx             # Thanh điều hướng
│   │   └── ...                    # Các component ZaUI khác
│   ├── app.ts                     # Entry point
│   └── router.tsx                 # Router config
├── app-config.json                # Cấu hình Zalo Mini App
├── vite.config.mts                # Vite config
└── package.json                   # Dependencies
```

## Chạy ứng dụng

### Cài đặt zmp-cli (lần đầu tiên)
```bash
npm install -g zmp-cli
```

### Start development server
```bash
cd epcvinaminiapp
npm install
npm run start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Deploy

```bash
npm run deploy        # Deploy lên môi trường Development
npm run deploy:prod   # Deploy lên môi trường Production
```

## Tính năng

✅ Giao diện mobile-optimized
✅ Tích hợp Zalo Mini App SDK
✅ Điều hướng 4 tab chính
✅ Thông tin EPCVINA Solar đầy đủ
✅ Nút gọi điện nhanh
✅ Responsive design với Tailwind CSS
✅ Icon hiện đại với Lucide React

## Tech Stack

- **React 18** - UI Library
- **Zalo Mini App SDK (zmp-sdk)** - Zalo Platform
- **ZaUI** - Zalo UI Components
- **Tailwind CSS** - Styling
- **Vite** - Build Tool
- **TypeScript** - Type Safety
- **Lucide React** - Icons
- **Jotai** - State Management

## Ghi chú

- Ứng dụng sử dụng template `zaui-market` của Zalo
- Đã tối ưu cho mobile và Zalo Mini App environment
- Màu sắc theo brand EPCVINA (đỏ #DC2626)
- Nội dung đồng bộ với epcvinasolar website
