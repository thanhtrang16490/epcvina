# Environment Setup Guide

## Overview

Hướng dẫn này giải thích cách setup và quản lý environment variables cho ứng dụng epcvina-expo, bao gồm OAuth credentials cho Google, Facebook, và Zalo.

## Environment Files

Project sử dụng các environment files sau:

| File | Purpose | Git Status |
|------|---------|------------|
| `.env` | Active environment config | Gitignored (chứa credentials thực) |
| `.env.example` | Template với placeholders | Committed (template cho developers) |
| `.env.development` | Development environment | Committed hoặc gitignored tùy team |
| `.env.staging` | Staging environment | Committed hoặc gitignored tùy team |
| `.env.production` | Production environment | Committed hoặc gitignored tùy team |

## Initial Setup

### 1. Clone Repository và Install Dependencies

```bash
git clone <repository-url>
cd epcvina-expo
npm install
```

### 2. Create Local .env File

Copy template file và điền credentials:

```bash
cp .env.example .env
```

Hoặc copy từ environment-specific file:

```bash
# For development
cp .env.development .env

# For staging
cp .env.staging .env

# For production
cp .env.production .env
```

### 3. Configure OAuth Credentials

Mở file `.env` và điền OAuth credentials cho từng provider.

## OAuth Provider Setup

### Google OAuth Setup

1. **Truy cập Google Cloud Console**
   - URL: https://console.cloud.google.com/

2. **Tạo hoặc chọn Project**
   - Click "Select a project" → "New Project"
   - Đặt tên project: `epcvina-{environment}` (e.g., epcvina-dev, epcvina-prod)

3. **Enable Google Sign-In API**
   - Navigation menu → "APIs & Services" → "Library"
   - Search "Google Sign-In API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   
   **For iOS:**
   - "APIs & Services" → "Credentials" → "Create Credentials" → "OAuth client ID"
   - Application type: "iOS"
   - Bundle ID: `com.epcvina.app` (from app.json)
   - Copy the Client ID → `GOOGLE_IOS_CLIENT_ID`

   **For Android:**
   - "Create Credentials" → "OAuth client ID"
   - Application type: "Android"
   - Package name: `com.epcvina.app`
   - SHA-1 certificate fingerprint: (get from `keytool` or Expo)
   - Copy the Client ID → `GOOGLE_ANDROID_CLIENT_ID`

   **Web Client ID:**
   - "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `epcvina://oauth/google/callback`
   - Copy the Client ID → `GOOGLE_CLIENT_ID`

5. **Update .env file**
   ```bash
   GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
   GOOGLE_IOS_CLIENT_ID=123456789-ios.apps.googleusercontent.com
   GOOGLE_ANDROID_CLIENT_ID=123456789-android.apps.googleusercontent.com
   GOOGLE_REDIRECT_URI=epcvina://oauth/google/callback
   ```

### Facebook OAuth Setup

1. **Truy cập Facebook Developers**
   - URL: https://developers.facebook.com/

2. **Tạo hoặc chọn App**
   - Click "My Apps" → "Create App"
   - Use case: "Consumer"
   - App name: `APPEJV {Environment}` (e.g., APPEJV Development)

3. **Add Facebook Login Product**
   - Dashboard → "Add Product"
   - Find "Facebook Login" → Click "Set Up"

4. **Configure OAuth Settings**
   - Facebook Login → Settings
   - Valid OAuth Redirect URIs: `epcvina://oauth/facebook/callback`
   - Save changes

5. **Add Platforms**
   
   **For iOS:**
   - Settings → Basic → "Add Platform" → "iOS"
   - Bundle ID: `com.epcvina.app`
   - Save changes

   **For Android:**
   - Settings → Basic → "Add Platform" → "Android"
   - Package Name: `com.epcvina.app`
   - Class Name: `com.epcvina.MainActivity`
   - Key Hashes: (generate from keytool)
   - Save changes

6. **Get App ID**
   - Settings → Basic
   - Copy "App ID" → `FACEBOOK_APP_ID`

7. **Update .env file**
   ```bash
   FACEBOOK_APP_ID=1234567890123456
   FACEBOOK_REDIRECT_URI=epcvina://oauth/facebook/callback
   ```

### Zalo OAuth Setup

1. **Truy cập Zalo Developers**
   - URL: https://developers.zalo.me/

2. **Tạo hoặc chọn App**
   - Click "Ứng dụng của tôi" → "Tạo ứng dụng"
   - Loại ứng dụng: "Ứng dụng di động"
   - Tên ứng dụng: `APPEJV {Environment}`

3. **Enable OAuth 2.0**
   - Dashboard → "Cài đặt" → "OAuth Settings"
   - Enable "OAuth 2.0"

4. **Configure Redirect URI**
   - OAuth Redirect URIs: `epcvina://oauth/zalo/callback`
   - Save changes

5. **Add Platform Information**
   
   **For iOS:**
   - "Cài đặt" → "Nền tảng" → "iOS"
   - Bundle ID: `com.epcvina.app`
   - Save

   **For Android:**
   - "Cài đặt" → "Nền tảng" → "Android"
   - Package Name: `com.epcvina.app`
   - Save

6. **Get App Credentials**
   - Dashboard → "Thông tin ứng dụng"
   - Copy "App ID" → `ZALO_APP_ID`
   - Copy "App Secret" → `ZALO_APP_SECRET`
   - ⚠️ **IMPORTANT**: Keep App Secret secure!

7. **Update .env file**
   ```bash
   ZALO_APP_ID=1234567890123456789
   ZALO_APP_SECRET=abcdefghijklmnopqrstuvwxyz123456
   ZALO_REDIRECT_URI=epcvina://oauth/zalo/callback
   ```

## Environment Management

### Development Environment

Sử dụng cho local development:

```bash
# Switch to development
cp .env.development .env

# Start Expo
npm start
```

**Characteristics:**
- API URL points to localhost or dev server
- OAuth apps configured for development
- Error tracking enabled, analytics disabled
- Relaxed security for easier debugging

### Staging Environment

Sử dụng cho testing trước production:

```bash
# Switch to staging
cp .env.staging .env

# Build for staging
eas build --profile staging
```

**Characteristics:**
- API URL points to staging server
- Separate OAuth apps for staging
- Both analytics and error tracking enabled
- Production-like configuration

### Production Environment

Sử dụng cho production builds:

```bash
# Switch to production
cp .env.production .env

# Build for production
eas build --profile production
```

**Characteristics:**
- API URL points to production server
- Production OAuth apps
- All monitoring enabled
- Strict security settings

## NPM Scripts (Recommended)

Thêm vào `package.json` để dễ dàng switch environments:

```json
{
  "scripts": {
    "env:dev": "cp .env.development .env && echo 'Switched to development environment'",
    "env:staging": "cp .env.staging .env && echo 'Switched to staging environment'",
    "env:prod": "cp .env.production .env && echo 'Switched to production environment'",
    
    "start:dev": "npm run env:dev && expo start",
    "start:staging": "npm run env:staging && expo start",
    
    "build:dev": "npm run env:dev && eas build --profile development",
    "build:staging": "npm run env:staging && eas build --profile staging",
    "build:prod": "npm run env:prod && eas build --profile production"
  }
}
```

Usage:
```bash
# Start development server with dev config
npm run start:dev

# Build staging
npm run build:staging

# Build production
npm run build:prod
```

## Verification

### Check Environment Variables

Sau khi setup, verify environment variables được load đúng:

```typescript
// In your app code
import Constants from 'expo-constants'

console.log('Environment:', {
  apiUrl: Constants.expoConfig?.extra?.apiUrl,
  googleClientId: Constants.expoConfig?.extra?.googleClientId,
  facebookAppId: Constants.expoConfig?.extra?.facebookAppId,
  zaloAppId: Constants.expoConfig?.extra?.zaloAppId,
})
```

### Test OAuth Configuration

Run validation khi app khởi động:

```typescript
import { validateOAuthConfigOnStartup } from '@/lib/oauth-config'

// In app entry point
validateOAuthConfigOnStartup()
```

Check console output:
- ✅ No warnings = All configs valid
- ⚠️ Warnings = Missing or invalid configs

## Security Best Practices

### 1. Never Commit Credentials

```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore
echo ".env*.local" >> .gitignore
```

### 2. Use Different Apps Per Environment

- Create separate OAuth apps for dev, staging, prod
- Use different redirect URIs if possible
- Easier to debug and isolate issues

### 3. Rotate Secrets Regularly

- Change OAuth secrets every 3-6 months
- Update all environment files
- Coordinate with team

### 4. Limit OAuth Scopes

Only request necessary permissions:
- Google: `profile`, `email`
- Facebook: `public_profile`, `email`
- Zalo: `id`, `name`, `picture`

### 5. Use CI/CD Secrets

For automated builds, inject secrets from CI/CD:

**GitHub Actions:**
```yaml
- name: Create .env file
  run: |
    echo "GOOGLE_CLIENT_ID=${{ secrets.GOOGLE_CLIENT_ID }}" >> .env
    echo "FACEBOOK_APP_ID=${{ secrets.FACEBOOK_APP_ID }}" >> .env
    echo "ZALO_APP_ID=${{ secrets.ZALO_APP_ID }}" >> .env
```

**EAS Secrets:**
```bash
eas secret:create --name GOOGLE_CLIENT_ID --value "your-value"
eas secret:create --name FACEBOOK_APP_ID --value "your-value"
eas secret:create --name ZALO_APP_ID --value "your-value"
```

## Troubleshooting

### Issue: Environment variables not loading

**Solution:**
1. Verify `.env` file exists in project root
2. Check `app.config.js` loads environment variables
3. Restart Expo development server
4. Clear cache: `expo start -c`

### Issue: OAuth buttons disabled

**Solution:**
1. Check console for configuration warnings
2. Verify all required fields in `.env`
3. Run `validateOAuthConfigOnStartup()`
4. Check provider-specific setup

### Issue: OAuth redirect not working

**Solution:**
1. Verify redirect URIs match in `.env` and provider console
2. Check URL scheme configured in `app.json`
3. Test deep linking: `npx uri-scheme open epcvina://oauth/google/callback --ios`
4. Check native platform configuration (Info.plist, AndroidManifest.xml)

### Issue: Different behavior between environments

**Solution:**
1. Verify correct `.env` file is active
2. Check environment-specific OAuth apps are configured
3. Clear app data and reinstall
4. Check API URLs point to correct servers

## Team Collaboration

### For New Team Members

1. Clone repository
2. Copy `.env.example` to `.env`
3. Ask team lead for development OAuth credentials
4. Run `npm install`
5. Run `npm run start:dev`

### Sharing Credentials Securely

**DO NOT:**
- ❌ Commit credentials to git
- ❌ Share via email or Slack
- ❌ Store in plain text files

**DO:**
- ✅ Use password manager (1Password, LastPass)
- ✅ Use secure secret sharing tools
- ✅ Use CI/CD secret management
- ✅ Document where to find credentials

## References

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Zalo OAuth Documentation](https://developers.zalo.me/docs/api/social-api/tai-lieu/xac-thuc-va-uy-quyen-cho-ung-dung-post-28)
- [OAuth 2.0 Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

## Next Steps

After environment setup:

1. ✅ Verify OAuth configuration with `validateOAuthConfigOnStartup()`
2. ✅ Test social login buttons appear on login screen
3. ✅ Test OAuth flows on iOS and Android
4. ✅ Verify user profile sync works correctly
5. ✅ Test account linking scenarios
6. ✅ Monitor authentication logs

For implementation details, see:
- [OAuth Configuration Guide](./OAUTH-CONFIGURATION.md)
- [Social Login Plan](./SOCIAL-LOGIN-PLAN.md)
