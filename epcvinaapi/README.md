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

## Endpoint mặc định

- `GET /health`
- `GET /ready`
- `GET /v1/meta`
