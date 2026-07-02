-- Add sample categories for testing
-- Run this in Supabase Dashboard > SQL Editor

-- Insert sample categories if they don't exist
INSERT INTO categories (name, description) VALUES
  ('Thức ăn chăn nuôi', 'Các loại thức ăn cho gia súc, gia cầm'),
  ('Thuốc thú y', 'Thuốc điều trị và phòng bệnh cho động vật'),
  ('Phụ gia dinh dưỡng', 'Vitamin, khoáng chất bổ sung'),
  ('Thiết bị chăn nuôi', 'Dụng cụ, máy móc phục vụ chăn nuôi')
ON CONFLICT (name) DO NOTHING;

-- Grant permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.products TO anon;

-- Check if categories exist
SELECT id, name, description FROM categories ORDER BY name;

-- Check permissions
SELECT 
  schemaname,
  tablename,
  grantee,
  privilege_type
FROM information_schema.table_privileges 
WHERE grantee = 'anon' 
  AND schemaname = 'public' 
  AND tablename IN ('products', 'categories')
ORDER BY tablename, privilege_type;