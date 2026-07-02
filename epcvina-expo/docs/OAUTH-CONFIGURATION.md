# OAuth Configuration Guide

## Overview

OAuth Configuration Manager quản lý cấu hình OAuth cho các providers: Google, Facebook, và Zalo. Module này đọc credentials từ environment variables và cung cấp interface type-safe để truy cập configuration.

## Setup

### 1. Cài đặt dependencies

```bash
npm install --save-dev dotenv
```

### 2. Cấu hình environment variables

Tạo file `.env` trong thư mục root của project:

```bash
# OAuth Configuration - Google
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id_here
GOOGLE_ANDROID_CLIENT_ID=your_google_android_client_id_here
GOOGLE_REDIRECT_URI=epcvina://oauth/google/callback

# OAuth Configuration - Facebook
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_REDIRECT_URI=epcvina://oauth/facebook/callback

# OAuth Configuration - Zalo
ZALO_APP_ID=your_zalo_app_id_here
ZALO_APP_SECRET=your_zalo_app_secret_here
ZALO_REDIRECT_URI=epcvina://oauth/zalo/callback
```

### 3. Lấy OAuth credentials

#### Google OAuth
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Enable Google Sign-In API
4. Tạo OAuth 2.0 Client IDs cho iOS và Android
5. Copy Client IDs vào `.env` file

#### Facebook OAuth
1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Tạo app mới hoặc chọn app hiện có
3. Thêm Facebook Login product
4. Copy App ID vào `.env` file

#### Zalo OAuth
1. Truy cập [Zalo Developers](https://developers.zalo.me/)
2. Tạo app mới hoặc chọn app hiện có
3. Enable OAuth 2.0
4. Copy App ID và App Secret vào `.env` file

## Usage

### Validate configuration khi app khởi động

Trong file `app/_layout.tsx` hoặc entry point của app:

```typescript
import { validateOAuthConfigOnStartup } from '@/lib/oauth-config'

export default function RootLayout() {
  useEffect(() => {
    // Validate OAuth configuration
    validateOAuthConfigOnStartup()
  }, [])

  // ... rest of your layout
}
```

### Lấy configuration cho một provider

```typescript
import { OAuthConfigManager } from '@/lib/oauth-config'

// Lấy Google configuration
const googleConfig = OAuthConfigManager.getConfig('google')
console.log(googleConfig.clientId)
console.log(googleConfig.iosClientId)
console.log(googleConfig.redirectUri)

// Lấy Facebook configuration
const facebookConfig = OAuthConfigManager.getConfig('facebook')
console.log(facebookConfig.appId)

// Lấy Zalo configuration
const zaloConfig = OAuthConfigManager.getConfig('zalo')
console.log(zaloConfig.appId)
console.log(zaloConfig.appSecret)
```

### Kiểm tra provider có được cấu hình đúng không

```typescript
import { OAuthConfigManager } from '@/lib/oauth-config'

if (OAuthConfigManager.isProviderConfigured('google')) {
  // Google OAuth is configured, show Google Sign-In button
  console.log('Google Sign-In is available')
} else {
  // Google OAuth is not configured, hide button
  console.log('Google Sign-In is not available')
}
```

### Lấy redirect URI

```typescript
import { OAuthConfigManager } from '@/lib/oauth-config'

const redirectUri = OAuthConfigManager.getRedirectUri('google')
console.log(redirectUri) // epcvina://oauth/google/callback
```

## Configuration Validation

Configuration Manager tự động validate tất cả required fields khi app khởi động:

- **Google**: Kiểm tra `clientId`, platform-specific client ID (iOS/Android), và `redirectUri`
- **Facebook**: Kiểm tra `appId` và `redirectUri`
- **Zalo**: Kiểm tra `appId`, `appSecret`, và `redirectUri`

Nếu thiếu configuration, warnings sẽ được log ra console nhưng app vẫn có thể chạy. Social login buttons cho providers thiếu config sẽ bị disable.

## Environment-Specific Configuration

Project đã được cấu hình với 3 environment files riêng biệt để quản lý configs cho từng môi trường:

### File Structure

```
epcvina-expo/
├── .env                    # Default/current environment (gitignored)
├── .env.example           # Template file (committed to git)
├── .env.development       # Development environment config
├── .env.staging          # Staging environment config
└── .env.production       # Production environment config
```

### Development Environment (.env.development)

Sử dụng cho local development và testing:

```bash
# API points to localhost or dev server
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1

# Use development OAuth credentials
GOOGLE_CLIENT_ID=your_dev_google_client_id_here
GOOGLE_IOS_CLIENT_ID=your_dev_google_ios_client_id_here
GOOGLE_ANDROID_CLIENT_ID=your_dev_google_android_client_id_here

FACEBOOK_APP_ID=your_dev_facebook_app_id_here

ZALO_APP_ID=your_dev_zalo_app_id_here
ZALO_APP_SECRET=your_dev_zalo_app_secret_here

# Error tracking enabled, analytics disabled
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_ERROR_TRACKING=true
```

### Staging Environment (.env.staging)

Sử dụng cho staging/testing trước khi deploy production:

```bash
# API points to staging server
EXPO_PUBLIC_API_URL=https://staging-api.epcvina.app/api/v1

# Use staging OAuth credentials
GOOGLE_CLIENT_ID=your_staging_google_client_id_here
GOOGLE_IOS_CLIENT_ID=your_staging_google_ios_client_id_here
GOOGLE_ANDROID_CLIENT_ID=your_staging_google_android_client_id_here

FACEBOOK_APP_ID=your_staging_facebook_app_id_here

ZALO_APP_ID=your_staging_zalo_app_id_here
ZALO_APP_SECRET=your_staging_zalo_app_secret_here

# Both analytics and error tracking enabled
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_ERROR_TRACKING=true
```

### Production Environment (.env.production)

Sử dụng cho production builds:

```bash
# API points to production server
EXPO_PUBLIC_API_URL=https://api.epcvina.app/api/v1

# Use production OAuth credentials
GOOGLE_CLIENT_ID=your_prod_google_client_id_here
GOOGLE_IOS_CLIENT_ID=your_prod_google_ios_client_id_here
GOOGLE_ANDROID_CLIENT_ID=your_prod_google_android_client_id_here

FACEBOOK_APP_ID=your_prod_facebook_app_id_here

ZALO_APP_ID=your_prod_zalo_app_id_here
ZALO_APP_SECRET=your_prod_zalo_app_secret_here

# Both analytics and error tracking enabled
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_ERROR_TRACKING=true
```

### Switching Between Environments

Để chuyển đổi giữa các environments:

**Option 1: Copy file thủ công**
```bash
# Switch to development
cp .env.development .env

# Switch to staging
cp .env.staging .env

# Switch to production
cp .env.production .env
```

**Option 2: Sử dụng npm scripts** (recommended)

Thêm vào `package.json`:
```json
{
  "scripts": {
    "env:dev": "cp .env.development .env",
    "env:staging": "cp .env.staging .env",
    "env:prod": "cp .env.production .env",
    "start:dev": "npm run env:dev && expo start",
    "start:staging": "npm run env:staging && expo start",
    "build:prod": "npm run env:prod && eas build --platform all"
  }
}
```

Sau đó chạy:
```bash
# Start development server with dev config
npm run start:dev

# Start with staging config
npm run start:staging

# Build production with prod config
npm run build:prod
```

### Important Notes

1. **Never commit `.env` file**: File `.env` chứa credentials thực và đã được thêm vào `.gitignore`

2. **Commit environment templates**: Files `.env.development`, `.env.staging`, `.env.production` có thể commit với placeholder values hoặc gitignore nếu chứa sensitive data

3. **Use CI/CD secrets**: Trong CI/CD pipeline, inject environment variables từ secrets thay vì commit vào repository

4. **Separate OAuth apps**: Tạo separate OAuth applications cho mỗi environment ở provider consoles để tránh conflicts và dễ debug

5. **Restart after changes**: Sau khi thay đổi `.env` file, restart Expo development server để load configs mới

## Security Best Practices

1. **Không commit `.env` file vào Git**: Thêm `.env` vào `.gitignore`
2. **Sử dụng `.env.example`**: Commit file template với placeholder values
3. **Rotate secrets định kỳ**: Thay đổi OAuth secrets theo lịch trình
4. **Giới hạn OAuth scopes**: Chỉ request permissions cần thiết
5. **Validate redirect URIs**: Đảm bảo redirect URIs được whitelist ở OAuth providers

## Troubleshooting

### Warning: "OAuth Configuration Warnings"

Nếu bạn thấy warnings trong console:
```
OAuth Configuration Warnings:
  - Google OAuth: Missing GOOGLE_CLIENT_ID
  - Facebook OAuth: Missing FACEBOOK_APP_ID
```

**Giải pháp**:
1. Kiểm tra file `.env` có tồn tại không
2. Kiểm tra các environment variables đã được set đúng chưa
3. Restart development server sau khi thay đổi `.env`

### Error: "OAuth configuration not initialized"

Nếu bạn gặp error này:
```
OAuthConfigError: OAuth configuration not initialized
```

**Giải pháp**:
1. Đảm bảo `app.config.js` đã load environment variables đúng
2. Kiểm tra `Constants.expoConfig.extra` có chứa OAuth configs không
3. Restart Expo development server

### Provider button bị disabled

Nếu social login button bị disabled:

1. Kiểm tra `isProviderConfigured()` trả về `true`
2. Verify tất cả required fields đã được set trong `.env`
3. Check console logs để xem warnings cụ thể

## API Reference

### Types

```typescript
type OAuthProvider = 'google' | 'facebook' | 'zalo'

interface GoogleOAuthConfig {
  clientId: string
  iosClientId?: string
  androidClientId?: string
  redirectUri: string
}

interface FacebookOAuthConfig {
  appId: string
  redirectUri: string
}

interface ZaloOAuthConfig {
  appId: string
  appSecret: string
  redirectUri: string
}
```

### Methods

#### `getConfig(provider: OAuthProvider): ProviderConfig`
Lấy configuration cho một provider cụ thể.

#### `getAllConfig(): OAuthConfig`
Lấy toàn bộ OAuth configuration.

#### `validateConfig(): void`
Validate tất cả required configuration. Log warnings nếu thiếu config.

#### `getRedirectUri(provider: OAuthProvider): string`
Lấy redirect URI cho platform hiện tại.

#### `isProviderConfigured(provider: OAuthProvider): boolean`
Kiểm tra xem provider có được cấu hình đầy đủ không.

### Functions

#### `validateOAuthConfigOnStartup(): void`
Validate OAuth configuration khi app khởi động. Gọi hàm này trong app entry point.

## Testing

Run unit tests:

```bash
npm test -- oauth-config.test.ts
```

Test coverage:
- Configuration loading từ environment variables
- Validation logic cho từng provider
- Platform-specific configuration (iOS/Android)
- Error handling

## Next Steps

Sau khi setup OAuth Configuration Manager:

1. Implement `SocialAuthService` để xử lý OAuth flows
2. Tạo `SocialLoginButton` components
3. Cập nhật `AuthContext` để support social login
4. Test OAuth flows trên iOS và Android devices

## References

- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/ios)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Zalo OAuth Documentation](https://developers.zalo.me/docs/api/social-api/tai-lieu/xac-thuc-va-uy-quyen-cho-ung-dung-post-28)
- [Expo Constants Documentation](https://docs.expo.dev/versions/latest/sdk/constants/)
