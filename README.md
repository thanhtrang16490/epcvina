# EPCVINA

Monorepo cho hệ sinh thái EPCVINA, gồm website doanh nghiệp, website điện mặt trời, hệ thống quản trị, API và các ứng dụng di động.

## Ứng dụng chính

| Thư mục | Vai trò | Công nghệ |
| --- | --- | --- |
| `epcvinahome/` | Website doanh nghiệp `epcvina.com` | Astro |
| `epcvinasolar/` | Website điện mặt trời và trang báo giá | Astro, React |
| `epcvinaadmin/` | CRM và trang quản trị | Next.js, Supabase |
| `epcvinaapi/` | API dịch vụ | Go |
| `epcvina-expo/` | Ứng dụng di động | Expo, React Native |
| `epcvinaminiapp/` | Zalo Mini App | ZMP, React |
| `solargiare24h/` | Website `solargiare24h.com` | Astro |
| `epcvinamarketing/` | Tài liệu và tài sản marketing | Markdown, PDF |

## Chạy website chính

Yêu cầu Node.js 22.12 trở lên.

```bash
npm install
npm run dev:home
# hoặc
npm run dev:solar
```

Mỗi ứng dụng độc lập có `package.json` và hướng dẫn/script riêng. Cài dependency trong đúng thư mục ứng dụng trước khi chạy.

## Build triển khai kết hợp

```bash
npm run build
npm start
```

Lệnh build tạo `epcvinahome/dist`, tạo bản SSR của `epcvinasolar`, rồi ghép website tĩnh vào client output của Solar. Xem [DEPLOYMENT.md](./DEPLOYMENT.md) để biết cấu hình triển khai.

## Quy ước repository

- Không commit `.env`, cache, `node_modules`, `dist`, `.next`, `.astro`, `.expo` hoặc `*.tsbuildinfo`.
- `output/` và `tmp/` dành cho báo cáo/tệp sinh tự động và không được đưa vào Git.
- Migration Supabase nằm tại `epcvinaadmin/supabase/migrations/`; không xóa migration chỉ vì chưa được commit.

## Contact

- **Phone:** 0988 446 113 (Mrs. Giang)
- **Email:** epcvina@hotmail.com
- **Address:** Phòng 315 - Khu TM Chung cư HVQP, Đường Nguyễn Văn Huyên Kéo Dài, Q. Tây Hồ, Hà Nội
