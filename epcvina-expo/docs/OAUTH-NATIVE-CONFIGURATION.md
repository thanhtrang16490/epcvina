# OAuth Native Platform Configuration Guide

This document provides instructions for configuring native platform settings for OAuth deep linking and provider SDKs on iOS and Android.

## Overview

Task 1.4 has configured the native platform files with placeholders. You need to replace these placeholders with actual values from your OAuth provider dashboards.

## iOS Configuration

### 1. Info.plist Configuration

Location: `ios/APPEJV/Info.plist`

The following URL schemes have been added for OAuth deep linking:

```xml
<key>CFBundleURLTypes</key>
<array>
  <!-- App deep linking -->
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>epcvina</string>
      <string>com.epcvina.app</string>
    </array>
  </dict>
  
  <!-- Google OAuth -->
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLName</key>
    <string>Google OAuth</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.googleusercontent.apps.YOUR_REVERSED_CLIENT_ID</string>
    </array>
  </dict>
  
  <!-- Facebook OAuth -->
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLName</key>
    <string>Facebook OAuth</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>fbYOUR_FACEBOOK_APP_ID</string>
    </array>
  </dict>
</array>
```

**Required Actions:**

1. **Google Sign-In:**
   - Replace `YOUR_REVERSED_CLIENT_ID` with your actual reversed client ID
   - Get this from Google Cloud Console → Credentials → iOS OAuth 2.0 Client ID
   - Format: `com.googleusercontent.apps.123456789-abcdefg`
   - Also update `GIDClientID` key with your iOS Client ID

2. **Facebook Login:**
   - Replace `YOUR_FACEBOOK_APP_ID` with your actual Facebook App ID
   - Get this from Facebook Developers Console → Your App → Settings → Basic
   - Also update `FacebookAppID`, `FacebookClientToken`, and `FacebookDisplayName` keys

3. **Query Schemes:**
   - The following schemes have been added to `LSApplicationQueriesSchemes`:
     - `fbapi`, `fb-messenger-share-api`, `fbauth2`, `fbshareextension` (Facebook)
     - `googlechrome`, `googlechromes` (Google)

### 2. GoogleService-Info.plist

Location: `ios/APPEJV/GoogleService-Info.plist`

A placeholder file has been created. You need to:

1. Download the actual `GoogleService-Info.plist` from Firebase Console
2. Go to Firebase Console → Project Settings → Your iOS App
3. Download the configuration file
4. Replace the placeholder file with the downloaded file

**OR** manually update these keys in the placeholder:
- `CLIENT_ID`: Your Google iOS Client ID
- `REVERSED_CLIENT_ID`: Your reversed client ID (for URL scheme)
- `API_KEY`: Your Google API Key
- `GCM_SENDER_ID`: Your GCM Sender ID
- `PROJECT_ID`: Your Firebase project ID
- `GOOGLE_APP_ID`: Your Google App ID

## Android Configuration

### 1. AndroidManifest.xml Configuration

Location: `android/app/src/main/AndroidManifest.xml`

The following configurations have been added:

#### Meta-data for Facebook SDK:
```xml
<meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>
<meta-data android:name="com.facebook.sdk.ClientToken" android:value="@string/facebook_client_token"/>
```

#### Intent Filters for OAuth Callbacks:
```xml
<!-- Google OAuth callback -->
<intent-filter>
  <action android:name="android.intent.action.VIEW"/>
  <category android:name="android.intent.category.DEFAULT"/>
  <category android:name="android.intent.category.BROWSABLE"/>
  <data android:scheme="epcvina" android:host="oauth" android:pathPrefix="/google"/>
</intent-filter>

<!-- Facebook OAuth callback -->
<intent-filter>
  <action android:name="android.intent.action.VIEW"/>
  <category android:name="android.intent.category.DEFAULT"/>
  <category android:name="android.intent.category.BROWSABLE"/>
  <data android:scheme="epcvina" android:host="oauth" android:pathPrefix="/facebook"/>
</intent-filter>

<!-- Zalo OAuth callback -->
<intent-filter>
  <action android:name="android.intent.action.VIEW"/>
  <category android:name="android.intent.category.DEFAULT"/>
  <category android:name="android.intent.category.BROWSABLE"/>
  <data android:scheme="epcvina" android:host="oauth" android:pathPrefix="/zalo"/>
</intent-filter>
```

#### Facebook SDK Activities:
```xml
<activity android:name="com.facebook.FacebookActivity" 
          android:configChanges="keyboard|keyboardHidden|screenLayout|screenSize|orientation" 
          android:label="@string/app_name"/>
<activity android:name="com.facebook.CustomTabActivity" android:exported="true">
  <intent-filter>
    <action android:name="android.intent.action.VIEW"/>
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE"/>
    <data android:scheme="@string/fb_login_protocol_scheme"/>
  </intent-filter>
</activity>
```

### 2. strings.xml Configuration

Location: `android/app/src/main/res/values/strings.xml`

The following Facebook configuration strings have been added:

```xml
<string name="facebook_app_id" translatable="false">YOUR_FACEBOOK_APP_ID</string>
<string name="facebook_client_token" translatable="false">YOUR_FACEBOOK_CLIENT_TOKEN</string>
<string name="fb_login_protocol_scheme" translatable="false">fbYOUR_FACEBOOK_APP_ID</string>
```

**Required Actions:**

1. Replace `YOUR_FACEBOOK_APP_ID` with your actual Facebook App ID (3 places)
2. Replace `YOUR_FACEBOOK_CLIENT_TOKEN` with your actual Facebook Client Token
3. Get these values from Facebook Developers Console → Your App → Settings → Basic

### 3. Google Sign-In Configuration

For Google Sign-In on Android, you need to:

1. **Add SHA-1 Fingerprint to Google Cloud Console:**
   ```bash
   # Get debug keystore SHA-1
   cd android
   ./gradlew signingReport
   
   # Or use keytool
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

2. **Add SHA-1 to Google Cloud Console:**
   - Go to Google Cloud Console → Credentials
   - Select your Android OAuth 2.0 Client ID
   - Add the SHA-1 fingerprint

3. **For production builds:**
   - Get SHA-1 from your release keystore
   - Add it to Google Cloud Console

## Environment Variables

Update your `.env.development` file with actual OAuth credentials:

```env
# OAuth Configuration - Google (Development)
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_IOS_CLIENT_ID=your_actual_google_ios_client_id
GOOGLE_ANDROID_CLIENT_ID=your_actual_google_android_client_id
GOOGLE_REDIRECT_URI=epcvina://oauth/google/callback

# OAuth Configuration - Facebook (Development)
FACEBOOK_APP_ID=your_actual_facebook_app_id
FACEBOOK_REDIRECT_URI=epcvina://oauth/facebook/callback

# OAuth Configuration - Zalo (Development)
ZALO_APP_ID=your_actual_zalo_app_id
ZALO_APP_SECRET=your_actual_zalo_app_secret
ZALO_REDIRECT_URI=epcvina://oauth/zalo/callback
```

## OAuth Provider Setup

### Google Sign-In Setup

1. **Create OAuth 2.0 Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google Sign-In API
   - Create OAuth 2.0 credentials for:
     - iOS (with bundle ID: `com.epcvina.app`)
     - Android (with package name: `com.epcvina.android` and SHA-1)
     - Web (for fallback)

2. **Configure Redirect URIs:**
   - iOS: `com.googleusercontent.apps.YOUR_REVERSED_CLIENT_ID:/oauth2redirect`
   - Android: Handled automatically by SDK
   - Custom scheme: `epcvina://oauth/google/callback`

### Facebook Login Setup

1. **Create Facebook App:**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or select existing
   - Add Facebook Login product

2. **Configure iOS:**
   - Add iOS platform
   - Bundle ID: `com.epcvina.app`
   - Enable Single Sign-On

3. **Configure Android:**
   - Add Android platform
   - Package name: `com.epcvina.android`
   - Add Key Hashes (SHA-1 converted to Base64)
   - Enable Single Sign-On

4. **Configure OAuth Redirect URIs:**
   - Add `epcvina://oauth/facebook/callback` to Valid OAuth Redirect URIs

### Zalo Login Setup

1. **Create Zalo App:**
   - Go to [Zalo Developers](https://developers.zalo.me/)
   - Create a new app or select existing
   - Enable Login API

2. **Configure Platforms:**
   - iOS Bundle ID: `com.epcvina.app`
   - Android Package: `com.epcvina.android`

3. **Configure Redirect URI:**
   - Add `epcvina://oauth/zalo/callback` to allowed redirect URIs

## Testing Deep Links

### iOS Testing:
```bash
# Test deep link on iOS simulator
xcrun simctl openurl booted "epcvina://oauth/google/callback?code=test"
xcrun simctl openurl booted "epcvina://oauth/facebook/callback?code=test"
xcrun simctl openurl booted "epcvina://oauth/zalo/callback?code=test"
```

### Android Testing:
```bash
# Test deep link on Android emulator/device
adb shell am start -W -a android.intent.action.VIEW -d "epcvina://oauth/google/callback?code=test"
adb shell am start -W -a android.intent.action.VIEW -d "epcvina://oauth/facebook/callback?code=test"
adb shell am start -W -a android.intent.action.VIEW -d "epcvina://oauth/zalo/callback?code=test"
```

## Verification Checklist

### iOS:
- [ ] `Info.plist` has correct URL schemes for all providers
- [ ] `GoogleService-Info.plist` is configured with actual values
- [ ] Facebook App ID and Client Token are set
- [ ] Google Client ID is set
- [ ] Query schemes are added for Facebook and Google
- [ ] Deep links work in simulator/device

### Android:
- [ ] `AndroidManifest.xml` has intent filters for all OAuth callbacks
- [ ] `strings.xml` has Facebook App ID and Client Token
- [ ] SHA-1 fingerprint is added to Google Cloud Console
- [ ] Facebook Key Hash is added to Facebook Developers Console
- [ ] Deep links work in emulator/device

### Environment:
- [ ] `.env.development` has all OAuth credentials
- [ ] `.env.production` is configured for production
- [ ] OAuth redirect URIs match in provider dashboards

## Troubleshooting

### iOS Issues:

1. **Google Sign-In not working:**
   - Verify `REVERSED_CLIENT_ID` matches Google Cloud Console
   - Check `GIDClientID` is set correctly
   - Ensure `GoogleService-Info.plist` is in the project

2. **Facebook Login not working:**
   - Verify Facebook App ID in `Info.plist`
   - Check URL scheme format: `fbYOUR_APP_ID`
   - Ensure query schemes are added

### Android Issues:

1. **Google Sign-In not working:**
   - Verify SHA-1 fingerprint is added to Google Cloud Console
   - Check package name matches: `com.epcvina.android`
   - Ensure Google Play Services is available

2. **Facebook Login not working:**
   - Verify Facebook App ID in `strings.xml`
   - Check Key Hash is added to Facebook Developers Console
   - Ensure Facebook SDK activities are in manifest

### Deep Link Issues:

1. **Deep links not opening app:**
   - Verify URL schemes in `Info.plist` (iOS)
   - Verify intent filters in `AndroidManifest.xml` (Android)
   - Test with `xcrun simctl openurl` (iOS) or `adb shell am start` (Android)

2. **OAuth callback not received:**
   - Check redirect URIs match in provider dashboards
   - Verify scheme format: `epcvina://oauth/{provider}/callback`
   - Check app is registered to handle the scheme

## Next Steps

After completing this configuration:

1. Test OAuth flows on both iOS and Android
2. Verify deep linking works correctly
3. Proceed to Task 2.1: Database migrations
4. Continue with Task 3: Implement core services

## References

- [Google Sign-In for iOS](https://developers.google.com/identity/sign-in/ios)
- [Google Sign-In for Android](https://developers.google.com/identity/sign-in/android)
- [Facebook Login for iOS](https://developers.facebook.com/docs/facebook-login/ios)
- [Facebook Login for Android](https://developers.facebook.com/docs/facebook-login/android)
- [Zalo Login Documentation](https://developers.zalo.me/docs/api/social-api/tai-lieu/dang-nhap-voi-zalo-post-28)
- [Expo Linking](https://docs.expo.dev/guides/linking/)
