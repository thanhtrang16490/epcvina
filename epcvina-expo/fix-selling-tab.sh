#!/bin/bash

echo "🔧 Fixing selling tab issue..."

# 1. Clear Expo cache
echo "1. Clearing Expo cache..."
rm -rf .expo
rm -rf node_modules/.cache

# 2. Clear Metro cache
echo "2. Clearing Metro cache..."
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*

# 3. Clear watchman
echo "3. Clearing watchman..."
watchman watch-del-all 2>/dev/null || echo "Watchman not installed, skipping..."

echo ""
echo "✅ Cache cleared!"
echo ""
echo "Now run: npm start -- --clear"
echo "Then press 'r' to reload the app"
