# EPCVINA Admin API Map

Tài liệu này đánh giá các API mà `epcvinaadmin` đang sử dụng và map sang các API cần có trên `epcvinaapi` trước khi nối hai hệ thống.

## Kết luận nhanh

- Admin hiện đang phụ thuộc mạnh vào các API cho `catalog`, `combos`, `products`, `customers`, `projects`, `suppliers` và export Excel.
- Nếu nối `epcvinaadmin` sang `epcvinaapi` mà thiếu nhóm `search`, `slug-exists`, `catalog`, `combos`, `customers`, `projects`, `suppliers` thì phần lớn màn hình quản trị sẽ lỗi hoặc không dùng được.
- Nên triển khai theo thứ tự:
  1. Health + catalog + search
  2. Customers + projects + suppliers + products
  3. Combos + combo export Excel
  4. Orders + CRM liên quan

---

## 1. API admin đang gọi trực tiếp

| API | Nơi dùng | Mức ưu tiên | Ghi chú |
|---|---|---:|---|
| `GET /api/health` | `AdminShell` | P0 | Check sống còn của backend |
| `GET /api/catalog` | `AdminShell`, dashboard | P0 | Dùng để render tổng quan catalog |
| `GET /api/combos` | dashboard / combo pages | P0 | Dùng cho list combo và public data |
| `GET /api/search/products` | `AsyncLookupSelect`, mapping, combo editor | P0 | Bắt buộc cho lookup sản phẩm |
| `GET /api/search/suppliers` | supplier mapping | P0 | Bắt buộc cho ánh xạ NCC |
| `GET /api/search/customers` | order/project/customer forms | P0 | Bắt buộc cho CRM forms |
| `GET /api/search/projects` | order/project forms | P0 | Bắt buộc cho chọn dự án |
| `GET /api/customers/slug-exists` | create customer | P0 | Validate slug trước khi lưu |
| `GET /api/combos/:id/excel` | combo excel export | P1 | Phải có để xuất BOM |

---

## 2. Nhóm API cần có trên `epcvinaapi`

### 2.1 System

- `GET /health`
- `GET /ready`
- `GET /v1/meta`
- `GET /api/health`
- `GET /api/catalog`
- `GET /api/config` nếu admin cần đọc cấu hình hiển thị

### 2.2 Search lookup

- `GET /api/search/products?q=`
- `GET /api/search/suppliers?q=`
- `GET /api/search/customers?q=&type=&parentCompanyId=`
- `GET /api/search/projects?q=&customerId=`

### 2.3 Customers

- `GET /api/customers`
- `GET /api/customers/:id`
- `POST /api/customers`
- `PATCH /api/customers/:id`
- `GET /api/customers/slug-exists?slug=`

### 2.4 Projects

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PATCH /api/projects/:id`

### 2.5 Suppliers

- `GET /api/suppliers`
- `GET /api/suppliers/:id`
- `POST /api/suppliers`
- `PATCH /api/suppliers/:id`

### 2.6 Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PATCH /api/products/:id`
- `GET /api/search/products`

### 2.7 Combos

- `GET /api/combos`
- `GET /api/combos/:id`
- `POST /api/combos`
- `PATCH /api/combos/:id`
- `GET /api/combos/:id/excel`
- `PUT /api/combos/:id/excel`

### 2.8 Orders

- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders`
- `PATCH /api/orders/:id`

---

## 3. Trạng thái hiện tại của `epcvinaapi`

Hiện backend mới chỉ có:

- `GET /health`
- `GET /ready`
- `GET /v1/meta`

Tức là:

- Chưa đủ cho `epcvinaadmin`
- Chưa có CRUD dữ liệu nghiệp vụ
- Chưa có search API
- Chưa có export Excel API
- Chưa có endpoint list/detail cho customers, projects, suppliers, products, combos, orders

---

## 4. Những màn hình admin sẽ lỗi nếu chưa có API

| Màn hình / chức năng | API thiếu | Hậu quả |
|---|---|---|
| Dashboard | `GET /api/health`, `GET /api/catalog` | Không lên số tổng quan |
| Chọn khách hàng | `GET /api/search/customers` | Form tạo dự án / đơn hàng không hoạt động |
| Chọn dự án | `GET /api/search/projects` | Không chọn được dự án theo khách |
| Chọn sản phẩm | `GET /api/search/products` | Không map sản phẩm vào combo / NCC |
| Chọn nhà cung cấp | `GET /api/search/suppliers` | Không map được supplier-product |
| Tạo khách hàng | `GET /api/customers/slug-exists` | Không kiểm tra trùng slug |
| Xuất combo Excel | `GET /api/combos/:id/excel` | Không tải được file BOM |

---

## 5. Ưu tiên triển khai trước khi nối admin

### P0

- `GET /api/health`
- `GET /api/catalog`
- `GET /api/search/products`
- `GET /api/search/suppliers`
- `GET /api/search/customers`
- `GET /api/search/projects`
- `GET /api/customers/slug-exists`

### P1

- CRUD customers
- CRUD projects
- CRUD suppliers
- CRUD products
- CRUD combos
- `GET /api/combos/:id/excel`

### P2

- CRUD orders
- CRM metrics
- audit logs
- permission/role API

---

## 6. Đánh giá rủi ro

- Admin đang dùng lookup async khá nhiều, nên thiếu search API là hỏng trải nghiệm ngay.
- Các form tạo khách hàng/dự án dùng slug và liên kết cha-con, nên phải có customers API đủ chuẩn ngay từ đầu.
- Export Excel combo là chức năng nghiệp vụ quan trọng, nên nếu chưa có trên backend mới thì chưa nên cutover admin.
- Tách API trước khi nối giúp tránh phải sửa admin nhiều lần.

---

## 7. Khuyến nghị

1. Hoàn thiện nhóm P0 trên `epcvinaapi`.
2. Tạo schema PostgreSQL cho `customers`, `projects`, `suppliers`, `products`, `combos`, `combo_items`, `orders`.
3. Nối `epcvinaadmin` sang `epcvinaapi` từng module một.
4. Giữ tạm lớp adapter trong admin nếu vẫn cần đọc Supabase cũ trong giai đoạn chuyển tiếp.

