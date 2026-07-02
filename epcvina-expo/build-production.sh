#!/bin/bash

# Build Production Script for APPE JV App
# Version 2 - Android Release

set -e

echo "🚀 Building APPE JV App - Version 2"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    echo -e "${RED}❌ Error: app.json not found. Please run this script from appejv-expo directory${NC}"
    exit 1
fi

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo -e "${RED}❌ EAS CLI not found${NC}"
    echo "Installing EAS CLI..."
    npm install -g eas-cli
fi

# Check EAS login
echo -e "${YELLOW}📋 Checking EAS authentication...${NC}"
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}Please login to EAS:${NC}"
    eas login
fi

echo ""
echo -e "${GREEN}✅ Pre-flight checks passed${NC}"
echo ""

# Show current version
CURRENT_VERSION=$(grep -o '"version": "[^"]*' app.json | grep -o '[^"]*$')
VERSION_CODE=$(grep -o '"versionCode": [0-9]*' app.json | grep -o '[0-9]*$')

echo "📱 Current App Version:"
echo "   Version Name: $CURRENT_VERSION"
echo "   Version Code: $VERSION_CODE"
echo ""

# Ask for confirmation
echo -e "${YELLOW}⚠️  This will build a production release${NC}"
echo "   Platform: Android"
echo "   Profile: production"
echo "   Build Type: AAB (App Bundle)"
echo "   Minification: Enabled (R8/ProGuard)"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Build cancelled"
    exit 0
fi

# Clear cache option
echo ""
read -p "Clear build cache? (recommended for first build) (y/n) " -n 1 -r
echo ""

CACHE_FLAG=""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    CACHE_FLAG="--clear-cache"
    echo -e "${YELLOW}🧹 Will clear cache before building${NC}"
fi

# Start build
echo ""
echo -e "${GREEN}🔨 Starting production build...${NC}"
echo ""

eas build --platform android --profile production $CACHE_FLAG

# Check build status
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Build completed successfully!${NC}"
    echo ""
    echo "📦 Next steps:"
    echo "   1. Download the AAB file from EAS dashboard"
    echo "   2. Submit to Google Play Console:"
    echo "      eas submit --platform android --latest"
    echo "   3. Or upload manually to Google Play Console"
    echo ""
    echo "📊 Verify in Google Play Console:"
    echo "   - Check App bundle explorer for mapping.txt"
    echo "   - Verify CAMERA permission warning is gone"
    echo "   - Check app size reduction"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Build failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "   1. Check build logs in EAS dashboard"
    echo "   2. Try clearing cache: eas build --clear-cache"
    echo "   3. Check android/app/build.gradle for errors"
    echo "   4. Verify ProGuard rules in android/app/proguard-rules.pro"
    exit 1
fi
