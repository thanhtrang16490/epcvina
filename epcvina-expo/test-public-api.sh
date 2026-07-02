#!/bin/bash

# Test script to check if public API works for products
# This simulates what the mobile app does

set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

SUPABASE_URL=${EXPO_PUBLIC_SUPABASE_URL}
SUPABASE_ANON_KEY=${EXPO_PUBLIC_SUPABASE_ANON_KEY}

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "❌ Missing environment variables"
  echo "   EXPO_PUBLIC_SUPABASE_URL: $SUPABASE_URL"
  echo "   EXPO_PUBLIC_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY:0:20}..."
  exit 1
fi

echo "🔍 Testing public API access..."
echo "📊 Supabase URL: $SUPABASE_URL"
echo "🔑 Anon Key: ${SUPABASE_ANON_KEY:0:20}..."
echo ""

# Test 1: Get products
echo "📦 Testing products API..."
PRODUCTS_URL="${SUPABASE_URL}/rest/v1/products?select=id,name,price,stock&limit=5"

curl -s -X GET "$PRODUCTS_URL" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" | jq '.'

echo ""

# Test 2: Get categories  
echo "📂 Testing categories API..."
CATEGORIES_URL="${SUPABASE_URL}/rest/v1/categories?select=id,name&limit=5"

curl -s -X GET "$CATEGORIES_URL" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" | jq '.'

echo ""
echo "✅ Test completed!"