#!/bin/bash

# Script to verify AAB file contents
# Usage: ./verify-aab.sh path/to/your.aab

if [ $# -eq 0 ]; then
    echo "Usage: $0 <path-to-aab-file>"
    echo "Example: $0 application-e977c8b2-da03-4edb-9792-69e3499909c3.aab"
    exit 1
fi

AAB_FILE="$1"

if [ ! -f "$AAB_FILE" ]; then
    echo "Error: File $AAB_FILE not found!"
    exit 1
fi

echo "🔍 Analyzing AAB file: $AAB_FILE"
echo "=================================================="

# Create temp directory
TEMP_DIR=$(mktemp -d)
echo "📁 Extracting to: $TEMP_DIR"

# Extract AAB file (it's a ZIP file)
cd "$TEMP_DIR"
unzip -q "$AAB_FILE"

echo ""
echo "📋 AAB Contents:"
ls -la

echo ""
echo "🔍 Checking AndroidManifest.xml for permissions..."

# Find and check AndroidManifest.xml files
find . -name "AndroidManifest.xml" -exec echo "Found manifest: {}" \;

# Use aapt2 if available, otherwise try bundletool
if command -v aapt2 &> /dev/null; then
    echo ""
    echo "📱 Permissions found in AAB:"
    find . -name "AndroidManifest.xml" -exec aapt2 dump permissions {} \; 2>/dev/null | grep -i camera || echo "✅ No CAMERA permission found"
elif command -v aapt &> /dev/null; then
    echo ""
    echo "📱 Permissions found in AAB:"
    find . -name "AndroidManifest.xml" -exec aapt dump permissions {} \; 2>/dev/null | grep -i camera || echo "✅ No CAMERA permission found"
else
    echo ""
    echo "⚠️  aapt/aapt2 not found. Checking manifest files manually..."
    find . -name "AndroidManifest.xml" -exec grep -l "CAMERA" {} \; 2>/dev/null || echo "✅ No CAMERA permission found in manifest files"
fi

echo ""
echo "🔍 Checking version code..."
if command -v aapt2 &> /dev/null; then
    find . -name "AndroidManifest.xml" -exec aapt2 dump badging {} \; 2>/dev/null | grep versionCode || echo "Could not extract version code"
elif command -v aapt &> /dev/null; then
    find . -name "AndroidManifest.xml" -exec aapt dump badging {} \; 2>/dev/null | grep versionCode || echo "Could not extract version code"
fi

# Cleanup
cd - > /dev/null
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Analysis complete!"
echo ""
echo "💡 If CAMERA permission is still found:"
echo "   1. Make sure you downloaded the latest AAB file"
echo "   2. Check the build ID matches: e977c8b2-da03-4edb-9792-69e3499909c3"
echo "   3. Verify the version code is 4"