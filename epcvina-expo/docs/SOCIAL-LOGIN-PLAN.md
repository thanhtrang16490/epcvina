# Kế Hoạch Triển Khai Social Login (Google, Facebook, Zalo)

## Tổng Quan

Tài liệu này mô tả kế hoạch chi tiết để bổ sung tính năng đăng nhập bằng tài khoản mạng xã hội (Social Login) cho ứng dụng APPE JV, bao gồm Google, Facebook và Zalo.

## Mục Tiêu

- Tăng tỷ lệ chuyển đổi người dùng mới bằng cách đơn giản hóa quy trình đăng ký/đăng nhập
- Giảm ma sát trong trải nghiệm người dùng
- Cung cấp nhiều lựa chọn đăng nhập cho người dùng Việt Nam
- Tích hợp với hệ thống authentication hiện tại (Supabase)

## Phạm Vi Dự Án

### Các Nền Tảng Hỗ Trợ

1. **Google Sign-In**
   - Phổ biến nhất toàn cầu
   - Hỗ trợ tốt trên cả iOS và Android
   - Tích hợp dễ dàng với Supabase

2. **Facebook Login**
   - Phổ biến tại Việt Nam
   - Hỗ trợ tốt trên mobile
   - Yêu cầu Facebook App ID

3. **Zalo Login**
   - Rất phổ biến tại Việt Nam
   - Đặc biệt quan trọng cho thị trường nội địa
   - Yêu cầu Zalo App ID và cấu hình đặc biệt

### Ứng Dụng Áp Dụng

- **epcvina-expo** (React Native/Expo) - Ưu tiên cao
- **epcvina-app** (Next.js) - Ưu tiên trung bình
- **epcvina-web** (Astro) - Ưu tiên thấp (nếu cần)

## Kiến Trúc Kỹ Thuật

### Stack Công Nghệ

```
┌─────────────────────────────────────────────────┐
│           Client Applications                    │
│  (epcvina-expo, epcvina-app, epcvina-web)          │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         OAuth Providers                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Google  │  │ Facebook │  │   Zalo   │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         Supabase Auth                            │
│  - OAuth flow management                         │
│  - Token exchange                                │
│  - User profile sync                             │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         PostgreSQL Database                      │
│  - auth.users (Supabase managed)                │
│  - public.profiles (Custom)                      │
│  - public.customers (Custom)                     │
└─────────────────────────────────────────────────┘
```

### Thư Viện Sử Dụng

#### Expo/React Native
- `@react-native-google-signin/google-signin` - Google Sign-In
- `react-native-fbsdk-next` - Facebook Login
- `@supabase/supabase-js` - Supabase client
- Custom Zalo SDK integration (cần research)

#### Next.js
- `next-auth` hoặc Supabase Auth helpers
- `@react-oauth/google` - Google OAuth
- `react-facebook-login` - Facebook Login

## Giai Đoạn Triển Khai

### Phase 1: Chuẩn Bị và Cấu Hình (1-2 tuần)

#### 1.1 Đăng Ký Developer Accounts

**Google Cloud Console**
- [ ] Tạo project mới hoặc sử dụng project hiện tại
- [ ] Enable Google+ API
- [ ] Tạo OAuth 2.0 credentials
  - Web client ID (cho epcvina-app)
  - iOS client ID (cho epcvina-expo)
  - Android client ID (cho epcvina-expo)
- [ ] Cấu hình OAuth consent screen
- [ ] Thêm authorized redirect URIs

**Facebook Developers**
- [ ] Tạo Facebook App
- [ ] Cấu hình Facebook Login product
- [ ] Thêm iOS Bundle ID
- [ ] Thêm Android Package Name và Key Hash
- [ ] Cấu hình OAuth redirect URIs
- [ ] Submit app cho review (nếu cần permissions đặc biệt)

**Zalo Developers**
- [ ] Đăng ký tài khoản Zalo Developer
- [ ] Tạo Zalo App
- [ ] Cấu hình Zalo Login
- [ ] Lấy App ID và Secret Key
- [ ] Cấu hình callback URLs
- [ ] Submit app cho review

#### 1.2 Cấu Hình Supabase

**Supabase Dashboard**
- [ ] Enable Google provider trong Authentication > Providers
- [ ] Enable Facebook provider
- [ ] Cấu hình redirect URLs
- [ ] Thêm environment variables cho OAuth credentials

**Database Schema Updates**
```sql
-- Thêm cột để track OAuth provider
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS oauth_provider TEXT,
ADD COLUMN IF NOT EXISTS oauth_uid TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Index cho tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_profiles_oauth 
ON public.profiles(oauth_provider, oauth_uid);

-- Thêm constraint unique cho OAuth UID
ALTER TABLE public.profiles 
ADD CONSTRAINT unique_oauth_uid 
UNIQUE (oauth_provider, oauth_uid);
```

#### 1.3 Cấu Hình Environment Variables

**epcvina-expo/.env**
```bash
# Google
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxx
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxx
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=xxx

# Facebook
EXPO_PUBLIC_FACEBOOK_APP_ID=xxx
EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN=xxx

# Zalo
EXPO_PUBLIC_ZALO_APP_ID=xxx
EXPO_PUBLIC_ZALO_APP_SECRET=xxx

# Supabase (existing)
EXPO_PUBLIC_SUPABASE_URL=xxx
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx
```

### Phase 2: Triển Khai Backend/Supabase (1 tuần)

#### 2.1 Database Migrations

**File: `epcvina-api/migrations/23_add_social_login_support.sql`**
```sql
-- Migration để hỗ trợ social login
-- Thêm các cột cần thiết vào profiles table
-- Tạo functions để xử lý OAuth user creation
-- Cập nhật RLS policies
```

#### 2.2 Edge Functions (Optional)

Nếu cần custom logic cho OAuth flow:
```typescript
// supabase/functions/oauth-callback/index.ts
// Xử lý callback từ OAuth providers
// Sync user data
// Create/update profile
```

#### 2.3 RLS Policies Update

Cập nhật Row Level Security policies để hỗ trợ users từ OAuth:
```sql
-- Cho phép OAuth users truy cập profiles của họ
-- Đảm bảo security không bị ảnh hưởng
```

### Phase 3: Triển Khai Frontend - Expo App (2-3 tuần)

#### 3.1 Cài Đặt Dependencies

```bash
cd epcvina-expo

# Google Sign-In
npx expo install @react-native-google-signin/google-signin

# Facebook Login
npx expo install react-native-fbsdk-next

# Zalo SDK (cần research thêm)
# Có thể cần custom native module
```

#### 3.2 Cấu Hình Native

**app.json updates**
```json
{
  "expo": {
    "plugins": [
      "@react-native-google-signin/google-signin",
      "react-native-fbsdk-next",
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ],
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist",
      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": [
              "fb{FACEBOOK_APP_ID}",
              "com.googleusercontent.apps.{GOOGLE_CLIENT_ID}"
            ]
          }
        ],
        "FacebookAppID": "{FACEBOOK_APP_ID}",
        "FacebookDisplayName": "APPE JV"
      }
    },
    "android": {
      "googleServicesFile": "./google-services.json",
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "fb{FACEBOOK_APP_ID}"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

#### 3.3 Tạo Social Auth Service

**File: `epcvina-expo/src/services/socialAuth.ts`**
```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { supabase } from './supabase';

export class SocialAuthService {
  // Google Sign-In
  static async signInWithGoogle() {
    // Implementation
  }

  // Facebook Login
  static async signInWithFacebook() {
    // Implementation
  }

  // Zalo Login
  static async signInWithZalo() {
    // Implementation
  }

  // Helper: Sync user profile
  private static async syncUserProfile(provider, userData) {
    // Implementation
  }
}
```

#### 3.4 Cập Nhật Login Screen

**File: `epcvina-expo/app/auth/login/page.tsx`**
- Thêm 3 nút social login
- Styling theo design system
- Error handling
- Loading states

#### 3.5 Cập Nhật AuthContext

**File: `epcvina-expo/src/contexts/AuthContext.tsx`**
- Thêm methods cho social login
- Handle OAuth callbacks
- Sync với existing auth flow

### Phase 4: Triển Khai Frontend - Next.js App (1-2 tuần)

#### 4.1 Cài Đặt Dependencies

```bash
cd epcvina-app

npm install @react-oauth/google react-facebook-login
```

#### 4.2 Tạo Social Auth Components

**File: `epcvina-app/components/auth/SocialLoginButtons.tsx`**
```typescript
// Google, Facebook, Zalo login buttons
// Reusable component
```

#### 4.3 Cập Nhật Login Page

**File: `epcvina-app/app/auth/login/page.tsx`**
- Integrate social login buttons
- Handle OAuth callbacks
- Error handling

### Phase 5: Testing và QA (1-2 tuần)

#### 5.1 Unit Tests
- [ ] Test social auth service methods
- [ ] Test OAuth token exchange
- [ ] Test profile sync logic

#### 5.2 Integration Tests
- [ ] Test complete OAuth flow cho mỗi provider
- [ ] Test error scenarios
- [ ] Test account linking (nếu user đã tồn tại)

#### 5.3 Manual Testing
- [ ] Test trên iOS device
- [ ] Test trên Android device
- [ ] Test trên web browsers
- [ ] Test với accounts mới
- [ ] Test với accounts đã tồn tại
- [ ] Test network failures
- [ ] Test permission denials

#### 5.4 Security Testing
- [ ] Verify OAuth tokens không bị leak
- [ ] Test RLS policies
- [ ] Test unauthorized access attempts
- [ ] Verify HTTPS enforcement

### Phase 6: Deployment và Monitoring (1 tuần)

#### 6.1 Staging Deployment
- [ ] Deploy lên staging environment
- [ ] Test với real OAuth credentials
- [ ] Internal testing

#### 6.2 Production Deployment
- [ ] Update production environment variables
- [ ] Run database migrations
- [ ] Deploy backend changes
- [ ] Deploy frontend changes
- [ ] Monitor error logs

#### 6.3 Monitoring Setup
- [ ] Track social login success/failure rates
- [ ] Monitor OAuth provider response times
- [ ] Set up alerts cho errors
- [ ] Analytics tracking

## Thách Thức và Giải Pháp

### 1. Zalo SDK Integration

**Thách thức:**
- Zalo không có official React Native SDK
- Documentation chủ yếu bằng tiếng Việt
- Cần native module integration

**Giải pháp:**
- Research community packages
- Có thể cần viết custom native module
- Fallback: Sử dụng WebView cho Zalo OAuth flow
- Alternative: Implement Zalo sau khi Google và Facebook stable

### 2. Account Linking

**Thách thức:**
- User có thể đã có account với email
- Cần merge accounts khi login bằng social

**Giải pháp:**
- Check email trùng lặp
- Prompt user để link accounts
- Implement account linking flow
- Clear communication với user

### 3. Profile Data Sync

**Thách thức:**
- Mỗi provider trả về data format khác nhau
- Cần normalize data
- Handle missing fields

**Giải pháp:**
- Tạo unified profile interface
- Mapping layer cho mỗi provider
- Default values cho missing fields
- Allow users update profile sau

### 4. Token Management

**Thách thức:**
- OAuth tokens có expiry
- Cần refresh tokens
- Secure storage

**Giải pháp:**
- Supabase handles token refresh
- Use secure storage (expo-secure-store)
- Implement token refresh logic
- Handle token expiry gracefully

## Timeline Tổng Thể

```
Week 1-2:  Phase 1 - Chuẩn bị và cấu hình
Week 3:    Phase 2 - Backend/Supabase
Week 4-6:  Phase 3 - Expo App implementation
Week 7-8:  Phase 4 - Next.js App implementation
Week 9-10: Phase 5 - Testing và QA
Week 11:   Phase 6 - Deployment

Total: 11 tuần (2.5 tháng)
```

## Resources và Tài Liệu

### Documentation
- [Supabase Auth with OAuth](https://supabase.com/docs/guides/auth/social-login)
- [Google Sign-In for React Native](https://github.com/react-native-google-signin/google-signin)
- [Facebook Login for React Native](https://github.com/thebergamo/react-native-fbsdk-next)
- [Zalo Developer Docs](https://developers.zalo.me/)

### Design Resources
- Social login button guidelines
- Brand assets từ mỗi provider
- UI/UX best practices

## Success Metrics

### KPIs
- **Adoption Rate**: % users chọn social login vs traditional
- **Conversion Rate**: % users hoàn thành registration qua social login
- **Time to Register**: Thời gian trung bình để complete registration
- **Error Rate**: % failed social login attempts
- **Provider Distribution**: % users cho mỗi provider (Google/Facebook/Zalo)

### Target Goals
- 40%+ users sử dụng social login
- <30 seconds để complete registration
- <5% error rate
- 90%+ user satisfaction

## Rủi Ro và Mitigation

### Rủi Ro Kỹ Thuật
1. **OAuth provider downtime** → Implement fallback to traditional login
2. **API changes từ providers** → Monitor provider changelogs, version pinning
3. **Native module conflicts** → Thorough testing, use stable versions

### Rủi Ro Bảo Mật
1. **Token leakage** → Secure storage, HTTPS only, regular security audits
2. **Account takeover** → Email verification, 2FA option
3. **Data privacy** → GDPR compliance, clear privacy policy

### Rủi Ro Business
1. **User confusion** → Clear UI/UX, onboarding flow
2. **Low adoption** → A/B testing, user education
3. **Support overhead** → Comprehensive documentation, FAQs

## Next Steps

1. **Review và approval** từ stakeholders
2. **Prioritize providers**: Bắt đầu với Google (easiest), sau đó Facebook, cuối cùng Zalo
3. **Assign resources**: Developers, QA, designers
4. **Setup tracking**: Project management tool, progress tracking
5. **Kickoff meeting**: Align team, clarify requirements

## Appendix

### A. Sample Code Snippets
### B. Database Schema Details
### C. API Endpoints
### D. Error Codes và Messages
### E. Testing Checklist

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-11  
**Author**: Development Team  
**Status**: Draft - Pending Review
