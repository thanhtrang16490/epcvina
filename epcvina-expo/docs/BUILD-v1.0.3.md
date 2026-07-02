# Build Version 1.0.3 (versionCode: 6)

## Build Information
- **Version**: 1.0.3
- **Version Code**: 6
- **Build Date**: March 11, 2025
- **Build ID**: e0df6699-cf84-41c4-861d-8224ff44cc33
- **Platform**: Android
- **Profile**: production

## Download
- **AAB File**: `app_version/application-v1.0.3-build6.aab`
- **Direct Link**: https://expo.dev/artifacts/eas/tLykNpGXcEG81vWz3n9aFa.aab
- **Build Logs**: https://expo.dev/accounts/thanhtrang16490/projects/epcvina/builds/e0df6699-cf84-41c4-861d-8224ff44cc33

## Changes in This Version

### 🎨 UI/UX Improvements
1. **Fixed Public Header Duplication**
   - Removed duplicate header in public section
   - Enhanced header with proper APPE JV logo and branding
   - Fixed safe area handling for proper spacing
   - Added subtitle "Thức ăn chăn nuôi" for brand clarity

2. **Fixed App Icon**
   - Resized adaptive icon with proper padding (65% logo size)
   - Added 179px padding on each side to prevent overflow
   - Changed background color to brand blue (#175ead)
   - Logo now fits perfectly within Android's safe zone

3. **Removed Stock Status from Public Pages**
   - Removed stock availability display from public product list
   - Removed stock status from public product detail page
   - Simplified public view for better user experience

### 🔧 Technical Improvements
1. **Direct Supabase Access for Public Products**
   - Converted from REST API to direct Supabase JS client
   - Fixed database schema mismatch (removed non-existent columns)
   - Added proper filtering for deleted products
   - Improved performance and type safety

2. **Database Permissions**
   - Granted anonymous read access to products and categories tables
   - Added migration for public read permissions
   - Created helper scripts for database setup

### 📝 Documentation
- Added `PUBLIC-HEADER-FIX.md` - Header duplication fix documentation
- Added `PUBLIC-PRODUCTS-FIX.md` - Public products conversion guide
- Added `FIX-APP-ICON.md` - App icon fix guide
- Added `resize-adaptive-icon.sh` - Automated icon resize script

## Files Modified
- `app.json` - Updated version to 1.0.3, versionCode to 6
- `android/app/build.gradle` - Updated versionCode to 6, versionName to 1.0.3
- `app/(public)/_layout.tsx` - Fixed header with logo and safe area
- `app/(public)/products.tsx` - Removed stock status, added direct Supabase access
- `app/(public)/product/[id].tsx` - Removed stock status and duplicate header
- `assets/adaptive-icon.png` - Resized with proper padding

## Testing Checklist
- [ ] App icon displays correctly without overflow
- [ ] Public header shows logo and branding properly
- [ ] Public products load from Supabase
- [ ] No duplicate headers in public section
- [ ] Safe area spacing is correct on all devices
- [ ] Stock status is hidden from public users
- [ ] Login flow works correctly
- [ ] All authenticated features work as expected

## Deployment
1. Upload AAB to Google Play Console
2. Submit for internal testing
3. Verify icon appearance on device
4. Test public product browsing
5. Promote to production after testing

## Known Issues
None

## Next Steps
- Monitor user feedback on new icon design
- Consider adding more public features
- Plan for iOS version with similar improvements
