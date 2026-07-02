#!/bin/bash

# Script to grant anon access to products and categories tables
# This enables public users to browse products without login

set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

SUPABASE_URL=${EXPO_PUBLIC_SUPABASE_URL}
SUPABASE_ANON_KEY=${EXPO_PUBLIC_SUPABASE_ANON_KEY}

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "❌ Missing environment variables"
  exit 1
fi

echo "🔄 Granting anon access to products and categories..."
echo "📊 Supabase URL: $SUPABASE_URL"
echo ""

# SQL to grant permissions
SQL="
-- Grant anon role public READ access for products and categories
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.categories TO anon;

-- Check current permissions
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
"

# Execute SQL via RPC (this requires the SQL to be wrapped in a function)
echo "📝 Executing SQL..."
echo "$SQL"
echo ""
echo "⚠️  Please run this SQL manually in Supabase Dashboard > SQL Editor"
echo "   Or ask your database admin to grant these permissions"
echo ""
echo "✅ Script completed!"