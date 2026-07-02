# Khắc phục lỗi Public Products

## Vấn đề đã khắc phục

### 1. Lỗi "column products.updated_at does not exist"

**Nguyên nhân**: Code cố gắng select cột `updated_at` không tồn tại trong database.

**Giải pháp**: 
- Cập nhật query để chỉ select các cột có sẵn
- Thêm filter `deleted_at IS NULL` để loại bỏ sản phẩm đã xóa
- Cập nhật Product type để phù hợp với database schema

**Files đã sửa**:
- `app/(public)/products.tsx`
- `app/(public)/product/[id].tsx` 
- `src/types/index.ts`

### 2. Chuyển từ REST API sang Supabase Client

**Thay đổi**:
- Từ: `supabaseGet()` - gọi trực tiếp REST API
- Sang: `supabasePublic` - sử dụng Supabase JS client

**Lợi ích**:
- Code đơn giản hơn
- Type safety tốt hơn
- Dễ debug và maintain

## Cấu trúc database hiện tại

### Products table
```sql
- id (string)
- name (string)
- code (string, optional)
- description (string, optional)
- price (number)
- stock (number)
- category_id (number, optional)
- image_url (string, optional)
- unit (string, optional)
- specifications (string, optional)
- created_at (timestamp)
- deleted_at (timestamp, nullable)
- slug (string, optional)
```

### Categories table
```sql
- id (number)
- name (string)
- description (string, optional)
- created_at (timestamp)
```

## Quyền truy cập

### Anonymous users cần có quyền:
```sql
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.categories TO anon;
```

### Kiểm tra quyền:
```bash
cd epcvina-expo
./test-public-api.sh
```

## Các bước để setup hoàn chỉnh

### 1. Chạy SQL trong Supabase Dashboard
```sql
-- File: add-sample-categories.sql
-- Thêm categories mẫu và cấp quyền
```

### 2. Test API
```bash
./test-public-api.sh
```

### 3. Test app
```bash
./test-app.sh
```

## Kết quả mong đợi

✅ **Products API hoạt động**: Anonymous users có thể xem danh sách sản phẩm
✅ **Categories API hoạt động**: Anonymous users có thể xem danh mục
✅ **App hoạt động**: Public users có thể browse sản phẩm mà không cần đăng nhập
✅ **Performance tốt**: Sử dụng Supabase client thay vì raw HTTP calls

## Troubleshooting

### Nếu vẫn lỗi "column does not exist"
1. Kiểm tra database schema
2. Cập nhật query để match với columns có sẵn
3. Cập nhật TypeScript types

### Nếu categories trống
1. Chạy `add-sample-categories.sql` trong Supabase Dashboard
2. Kiểm tra quyền anon role
3. Verify data tồn tại: `SELECT * FROM categories;`

### Nếu permission denied
1. Chạy GRANT statements trong Supabase Dashboard
2. Kiểm tra RLS policies
3. Test với `./test-public-api.sh`