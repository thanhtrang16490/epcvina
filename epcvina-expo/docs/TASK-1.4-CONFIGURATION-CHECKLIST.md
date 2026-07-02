# Task 1.4 Configuration Checklist

Quick reference for completing OAuth native platform configuration.

## Files Modified

### iOS Files:
- ✅ `ios/APPEJV/Info.plist` - Added URL schemes and OAuth provider keys
- ✅ `ios/APPEJV/GoogleService-Info.plist` - Created placeholder (needs actual values)

### Android Files:
- ✅ `android/app/src/main/AndroidManifest.xml` - Added intent filters and Facebook SDK config
- ✅ `android/app/src/main/res/values/strings.xml` - Added Facebook configuration strings

## Placeholders to Replace

### iOS Info.plist:
```
YOUR_REVERSED_CLIENT_ID → Get from Google Cloud Console
YOUR_FACEBOOK_APP_ID → Get from Facebook Developers Console
YOUR_FACEBOOK_CLIENT_TOKEN → Get from Facebook Developers Console
YOUR_GOOGLE_IOS_CLIENT_ID → Get from Google Cloud Console
```

### iOS GoogleService-Info.plist:
```
Download actual file from Firebase Console and replace the placeholder
OR manually update all YOUR_* placeholders in the file
```

### Android strings.xml:
```
YOUR_FACEBOOK_APP_ID → Get from Facebook Developers Console (3 places)
YOUR_FACEBOOK_CLIENT_TOKEN → Get from Facebook Developers Console
```

### Environment Variables (.env.development):
```
GOOGLE_CLIENT_ID → Replace placeholder
GOOGLE_IOS_CLIENT_ID → Replace placeholder
GOOGLE_ANDROID_CLIENT_ID → Replace placeholder
FACEBOOK_APP_ID → Replace placeholder
ZALO_APP_ID → Replace placeholder
ZALO_APP_SECRET → Replace placeholder
```

## URL Schemes Configured

### iOS (Info.plist):
- `epcvina://` - App deep linking
- `com.epcvina.app://` - App deep linking
- `com.googleusercontent.apps.YOUR_REVERSED_CLIENT_ID://` - Google OAuth
- `fbYOUR_FACEBOOK_APP_ID://` - Facebook OAuth

### Android (AndroidManifest.xml):
- `epcvina://` - App deep linking
- `epcvina://oauth/google` - Google OAuth callback
- `epcvina://oauth/facebook` - Facebook OAuth callback
- `epcvina://oauth/zalo` - Zalo OAuth callback

## OAuth Redirect URIs

Configure these in your OAuth provider dashboards:

- **Google:** `epcvina://oauth/google/callback`
- **Facebook:** `epcvina://oauth/facebook/callback`
- **Zalo:** `epcvina://oauth/zalo/callback`

## Provider Dashboard Setup Required

### Google Cloud Console:
1. Create OAuth 2.0 Client IDs for iOS and Android
2. Add iOS Bundle ID: `com.epcvina.app`
3. Add Android Package: `com.epcvina.android`
4. Add Android SHA-1 fingerprint (get with `./gradlew signingReport`)
5. Configure redirect URIs

### Facebook Developers Console:
1. Create or select your app
2. Add Facebook Login product
3. Configure iOS platform with Bundle ID: `com.epcvina.app`
4. Configure Android platform with Package: `com.epcvina.android`
5. Add Android Key Hash (SHA-1 converted to Base64)
6. Add OAuth redirect URI: `epcvina://oauth/facebook/callback`

### Zalo Developers Console:
1. Create or select your app
2. Enable Login API
3. Configure iOS Bundle ID: `com.epcvina.app`
4. Configure Android Package: `com.epcvina.android`
5. Add OAuth redirect URI: `epcvina://oauth/zalo/callback`

## Testing Commands

### Get Android SHA-1:
```bash
cd android
./gradlew signingReport
```

### Test iOS Deep Links:
```bash
xcrun simctl openurl booted "epcvina://oauth/google/callback?code=test"
```

### Test Android Deep Links:
```bash
adb shell am start -W -a android.intent.action.VIEW -d "epcvina://oauth/google/callback?code=test"
```

## Validation Steps

1. **iOS:**
   - [ ] Build project: `cd ios && pod install && cd ..`
   - [ ] Run on simulator: `npx expo run:ios`
   - [ ] Test deep links with `xcrun simctl openurl`
   - [ ] Verify URL schemes in Xcode project settings

2. **Android:**
   - [ ] Build project: `cd android && ./gradlew clean && cd ..`
   - [ ] Run on emulator: `npx expo run:android`
   - [ ] Test deep links with `adb shell am start`
   - [ ] Verify intent filters in merged manifest

3. **Environment:**
   - [ ] Copy `.env.example` to `.env.development`
   - [ ] Replace all OAuth placeholders with actual values
   - [ ] Verify configuration loads correctly in app

## Common Issues

### Issue: Google Sign-In fails on Android
**Solution:** Ensure SHA-1 fingerprint is added to Google Cloud Console

### Issue: Facebook Login fails on iOS
**Solution:** Verify Facebook App ID and URL scheme format in Info.plist

### Issue: Deep links don't open app
**Solution:** Check URL schemes (iOS) and intent filters (Android) are correctly configured

### Issue: OAuth callback not received
**Solution:** Verify redirect URIs match in provider dashboards and app configuration

## Documentation

See `docs/OAUTH-NATIVE-CONFIGURATION.md` for detailed setup instructions.

## Status

- ✅ Native platform files configured with placeholders
- ⏳ Waiting for actual OAuth credentials from provider dashboards
- ⏳ Pending testing on iOS and Android devices

## Next Steps

1. Obtain OAuth credentials from provider dashboards
2. Replace all placeholders with actual values
3. Test OAuth flows on both platforms
4. Proceed to Task 2.1: Database migrations
