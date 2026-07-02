#!/bin/bash

# Script to resize adaptive icon with proper padding for Android
# This ensures the logo doesn't overflow the safe zone

set -e

echo "🎨 Resizing adaptive icon with proper padding..."

INPUT_FILE="./assets/icon.png"
OUTPUT_FILE="./assets/adaptive-icon.png"
TEMP_FILE="./assets/temp-icon.png"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install imagemagick
    else
        echo "Please install ImageMagick manually:"
        echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
        echo "  macOS: brew install imagemagick"
        exit 1
    fi
fi

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Input file not found: $INPUT_FILE"
    exit 1
fi

echo "📏 Creating adaptive icon with safe zone padding..."

# Android adaptive icon specs:
# - Total size: 1024x1024px
# - Safe zone: 66% (675x675px) in the center
# - We'll use 65% to be extra safe (666x666px)
# - This leaves 179px padding on each side

# Step 1: Resize the logo to 65% of final size (666x666)
convert "$INPUT_FILE" -resize 666x666 -background none -gravity center -extent 666x666 "$TEMP_FILE"

# Step 2: Add padding to make it 1024x1024 with transparent background
convert "$TEMP_FILE" -background none -gravity center -extent 1024x1024 "$OUTPUT_FILE"

# Clean up temp file
rm -f "$TEMP_FILE"

echo "✅ Adaptive icon created successfully!"
echo "📁 Output: $OUTPUT_FILE"
echo ""
echo "📊 Icon specs:"
echo "  - Total size: 1024x1024px"
echo "  - Logo size: 666x666px (65%)"
echo "  - Padding: 179px on each side"
echo ""
echo "🔄 Next steps:"
echo "  1. Review the icon: open $OUTPUT_FILE"
echo "  2. If satisfied, rebuild the app:"
echo "     eas build --platform android --profile production"
