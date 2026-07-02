# Customer Login Fix - epcvina-expo

## Vấn đề

Khi user với role `customer` đăng nhập vào epcvina-expo, app bị lỗi và không thể load được dashboard hoặc các trang khác.

### Nguyên nhân

Sau migration 10 và 11 trong database:
- Bảng `customers` đã được tách riêng khỏi `profiles`
- Customers có cột `user_id` để link với `auth.users`
- Orders table có `customer_id` reference đến `customers.id` (không phải `auth.uid()`)

Nhưng code trong app vẫn đang:
1. Query trực tiếp `customer_id = user.id` (user.id là auth.uid())
2. Không có logic để tạo customer record cho users mới

### Lỗi cụ thể

```
Error fetching customer: {"code": "PGRST116", "details": "The result contains 0 rows", "hint": null, "message": "Cannot coerce the result to a single JSON object"}
```

## Giải pháp

### 1. Tạo Helper Function

Tạo file `src/lib/customer-helper.ts` với function `getOrCreateCustomer()`:
- Tìm customer record với `user_id = auth.uid()`
- Nếu không tìm thấy, tự động tạo customer record mới
- Xử lý race conditions và edge cases

### 2. Cập nhật Database Policies

Tạo migration `19_allow_customer_self_registration.sql`:
- Thêm INSERT policy cho customers tự tạo record
- Policy kiểm tra `user_id = auth.uid()` và role = 'customer'

```sql
CREATE POLICY "customers_self_insert" ON customers
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'customer'
    )
  );
```

### 3. Cập nhật Customer Pages

Cập nhật tất cả các trang customer để sử dụng `getOrCreateCustomer()`:

#### `app/(customer)/dashboard.tsx`
- Import `getOrCreateCustomer`
- Gọi helper để lấy customer.id trước khi query orders

#### `app/(customer)/orders/index.tsx`
- Dùng customer.id cho fetch orders
- Dùng customer.id cho update order status

#### `app/(customer)/orders/[id].tsx`
- Dùng customer.id cho fetch order detail
- Dùng customer.id cho confirm/cancel order

#### `app/(customer)/selling.tsx`
- Dùng customer.id khi tạo order mới

## Cách sử dụng

```typescript
import { getOrCreateCustomer } from '../../src/lib/customer-helper'

// Trong component
const { user } = useAuth()

// Lấy hoặc tạo customer record
const customerId = await getOrCreateCustomer(user)

if (!customerId) {
  // Handle error
  return
}

// Sử dụng customerId để query/update orders
const { data } = await supabase
  .from('orders')
  .select('*')
  .eq('customer_id', customerId)
```

## Testing

1. Đăng nhập với user có role `customer`
2. Kiểm tra console logs:
   - `[CustomerHelper] Getting customer for user: <user_id>`
   - `[CustomerHelper] Customer record not found, attempting to create...`
   - `[CustomerHelper] Customer record created successfully: <customer_id>`
3. Verify dashboard loads successfully
4. Verify có thể xem orders
5. Verify có thể tạo order mới

## Migration Checklist

- [x] Tạo migration 19_allow_customer_self_registration.sql
- [x] Chạy migration 19 trên database
- [x] Tạo migration 20_fix_customer_orders_policies.sql
- [ ] Chạy migration 20 trên database
- [x] Tạo migration 21_fix_orders_customer_fk.sql
- [ ] Chạy migration 21 trên database (CRITICAL!)
- [x] Tạo helper function getOrCreateCustomer()
- [x] Cập nhật dashboard.tsx
- [x] Cập nhật orders/index.tsx
- [x] Cập nhật orders/[id].tsx
- [x] Cập nhật selling.tsx
- [ ] Test với user customer (sau khi chạy tất cả migrations)

## Notes

- Helper function xử lý race conditions (unique constraint violations)
- Tự động tạo customer với email hoặc phone từ auth user
- Nếu không có email/phone, dùng fallback `<user_id>@customer.local`
- Policy đảm bảo chỉ customer users mới có thể tạo customer records
- Logs chi tiết giúp debug issues

## Related Files

- `src/lib/customer-helper.ts` - Helper function
- `app/(customer)/dashboard.tsx` - Dashboard page
- `app/(customer)/orders/index.tsx` - Orders list
- `app/(customer)/orders/[id].tsx` - Order detail
- `app/(customer)/selling.tsx` - Create order
- `migrations/19_allow_customer_self_registration.sql` - Customer self-registration
- `migrations/20_fix_customer_orders_policies.sql` - Fix orders RLS policies
- `migrations/21_fix_orders_customer_fk.sql` - Fix orders foreign key (CRITICAL!)

## Important Notes

⚠️ **CRITICAL**: All 3 migrations MUST be run in order!

**Migration Sequence:**
1. Migration 19 - Allows customers to create their own customer records
2. Migration 20 - Updates RLS policies to check via customers.user_id
3. Migration 21 - Fixes foreign key constraint to reference customers table

**Without all 3 migrations:**
- ✅ Login works
- ✅ Dashboard loads
- ✅ Can browse products
- ❌ Cannot create orders (FK constraint violation)
- ❌ Cannot view orders (if any exist)

**After running all 3 migrations:**
- ✅ All features work correctly
- ✅ Can create orders
- ✅ Can view orders
- ✅ Can update orders
