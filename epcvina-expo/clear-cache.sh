#!/bin/bash

echo "🧹 Clearing Expo cache..."

# Remove .expo folder
rm -rf .expo

# Remove node_modules cache
rm -rf node_modules/.cache

# Remove metro cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*

echo "✅ Cache cleared!"
echo ""
echo "Now run: npm start -- --clear"
