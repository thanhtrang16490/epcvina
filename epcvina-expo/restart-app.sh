#!/bin/bash

echo "�� Restarting Expo app to show Selling tab..."
echo ""
echo "Step 1: Clear all cache..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*

echo ""
echo "Step 2: Verify selling.tsx exists and has content..."
if [ -f "app/(sales)/selling.tsx" ]; then
    SIZE=$(wc -c < "app/(sales)/selling.tsx")
    if [ "$SIZE" -gt 100 ]; then
        echo "✅ selling.tsx exists ($SIZE bytes)"
    else
        echo "❌ selling.tsx is too small ($SIZE bytes)"
        exit 1
    fi
else
    echo "❌ selling.tsx not found!"
    exit 1
fi

echo ""
echo "Step 3: Check _layout.tsx has selling tab..."
if grep -q "name=\"selling\"" "app/(sales)/_layout.tsx"; then
    echo "✅ selling tab found in _layout.tsx"
else
    echo "❌ selling tab NOT found in _layout.tsx"
    exit 1
fi

echo ""
echo "Step 4: Check menu.tsx has selling item..."
if grep -q "Bán hàng" "app/(sales)/menu.tsx"; then
    echo "✅ Bán hàng found in menu.tsx"
else
    echo "❌ Bán hàng NOT found in menu.tsx"
    exit 1
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "Now run these commands:"
echo "  1. npm start -- --clear"
echo "  2. Press 'r' to reload"
echo "  3. Or shake device and select 'Reload'"
echo ""
echo "If still not showing:"
echo "  - Close app completely"
echo "  - Delete app from device/simulator"
echo "  - Run: npm start -- --clear"
echo "  - Reinstall app"
