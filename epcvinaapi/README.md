# epcvinaapi

API trung tâm cho EPCVINA, viết bằng Go + Fiber, dùng PostgreSQL làm CSDL.

## Mục tiêu

- Làm backend trung tâm cho website và các landing page
- Tách API ra khỏi frontend
- Chuẩn bị sẵn khung để sau này thêm lead, campaign, product, auth, upload, CRM sync

## Cấu trúc

```txt
epcvinaapi/
├── cmd/api/main.go
├── internal/config
├── internal/database
└── internal/httpserver
```

## Chạy local

```bash
cd epcvinaapi
cp .env.example .env
go mod tidy
go run ./cmd/api
```

## Chạy bằng Docker

```bash
cd epcvinaapi
docker compose up --build
```

PostgreSQL sẽ tự khởi tạo schema trong thư mục `sql/` khi container chạy lần đầu.

MinIO sẽ chạy cùng stack ở:

- API S3-compatible: `http://localhost:9000`
- Console: `http://localhost:9001`
- Bucket ảnh mặc định: `epcvina-images`

Upload ảnh:

```bash
curl -X POST http://localhost:8080/api/uploads/images \
  -F "file=@/path/to/image.jpg" \
  -F "folder=products"
```

Response trả về `url` công khai để lưu vào `cover_image_url`, `image_urls`, hoặc các cột ảnh khác giống Supabase Storage.

## Đồng bộ dữ liệu từ Supabase

Nếu cần kéo dữ liệu từ Supabase về PostgreSQL local, dùng script sync:

```bash
cd epcvinaapi
go run ./cmd/sync-supabase
```

Script sẽ đọc env từ `.env.local` hoặc `.env` và cần:

- `NEXT_PUBLIC_SUPABASE_URL` hoặc `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

Sync theo từng bảng:

```bash
go run ./cmd/sync-supabase --table products
go run ./cmd/sync-supabase --tables brands,products,combos
```

Lưu ý:

- Script hiện là one-way sync từ Supabase sang local PostgreSQL.
- Bảng nào đã có dữ liệu local sẽ bị xóa và nạp lại từ Supabase.
- Nếu cần bảo toàn local edits, hãy backup trước khi chạy.

## Endpoint mặc định

- `GET /health`
- `GET /ready`
- `GET /v1/meta`
