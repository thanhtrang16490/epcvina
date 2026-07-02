#!/bin/bash

# Test script for the mobile app
# This will start the development server and show QR code

echo "🚀 Starting APPE JV Mobile App..."
echo ""
echo "📱 Make sure you have:"
echo "   - Expo Go app installed on your phone"
echo "   - Phone and computer on same WiFi network"
echo ""
echo "🔧 Environment:"
echo "   - Supabase URL: ${EXPO_PUBLIC_SUPABASE_URL}"
echo "   - API URL: ${EXPO_PUBLIC_API_URL}"
echo ""

# Start Expo development server
npx expo start --clear