# EPCVINA Admin

Admin Next.js để quản lý combo, sản phẩm và lớp API trung gian cho EPCVINA Solar.

## Chạy local

```bash
npm install
npm run dev
```

## Kế hoạch tích hợp Supabase

- Thay `src/data/catalog.json` bằng dữ liệu đồng bộ từ Supabase.
- Dùng `src/lib/supabase/server.ts` và `src/lib/supabase/client.ts` cho SSR và client.
- Đưa các route `/api/*` sang đọc trực tiếp từ bảng `combos`, `products`, `combo_items`, `pricing_layers`.
