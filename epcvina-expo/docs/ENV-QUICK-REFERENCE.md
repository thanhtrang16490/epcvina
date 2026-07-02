# Environment Configuration - Quick Reference

## Quick Start

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Fill in your OAuth credentials
# Edit .env file with your actual values

# 3. Start development server
npm start
```

## Switch Environments

```bash
# Development
npm run env:dev
npm run start:dev

# Staging
npm run env:staging
npm run start:staging

# Production
npm run env:prod
```

## Environment Files

| File | Purpose | Git |
|------|---------|-----|
| `.env` | Active config | ❌ Gitignored |
| `.env.example` | Template | ✅ Committed |
| `.env.development` | Dev config | ⚠️ Optional |
| `.env.staging` | Staging config | ⚠️ Optional |
| `.env.production` | Prod config | ⚠️ Optional |

## Required Variables

### Core Configuration
```bash
EXPO_PUBLIC_API_URL=https://api.epcvina.app/api/v1
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

### Google OAuth
```bash
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=xxx-ios.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=xxx-android.apps.googleusercontent.com
GOOGLE_REDIRECT_URI=epcvina://oauth/google/callback
```

### Facebook OAuth
```bash
FACEBOOK_APP_ID=1234567890123456
FACEBOOK_REDIRECT_URI=epcvina://oauth/facebook/callback
```

### Zalo OAuth
```bash
ZALO_APP_ID=1234567890123456789
ZALO_APP_SECRET=your_secret_here
ZALO_REDIRECT_URI=epcvina://oauth/zalo/callback
```

## Get OAuth Credentials

### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google Sign-In API
3. Create OAuth 2.0 Client IDs (iOS, Android, Web)
4. Copy Client IDs to `.env`

### Facebook
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create app → Add Facebook Login
3. Configure platforms (iOS, Android)
4. Copy App ID to `.env`

### Zalo
1. Go to [Zalo Developers](https://developers.zalo.me/)
2. Create app → Enable OAuth 2.0
3. Configure platforms (iOS, Android)
4. Copy App ID and Secret to `.env`

## Verify Configuration

```typescript
// In your app
import { validateOAuthConfigOnStartup } from '@/lib/oauth-config'

validateOAuthConfigOnStartup()
// Check console for warnings
```

## Common Issues

### Variables not loading
```bash
# Restart Expo with cache clear
expo start -c
```

### OAuth buttons disabled
```bash
# Check configuration
npm run start:dev
# Look for "OAuth Configuration Warnings" in console
```

### Wrong environment active
```bash
# Verify active .env
cat .env | head -n 1
# Should show environment comment

# Switch to correct environment
npm run env:dev  # or env:staging, env:prod
```

## Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] Never commit real credentials
- [ ] Use separate OAuth apps per environment
- [ ] Rotate secrets every 3-6 months
- [ ] Use CI/CD secrets for automated builds
- [ ] Limit OAuth scopes to minimum required

## NPM Scripts Reference

```bash
# Environment switching
npm run env:dev          # Switch to development
npm run env:staging      # Switch to staging
npm run env:prod         # Switch to production

# Start with environment
npm run start:dev        # Start with dev config
npm run start:staging    # Start with staging config

# Standard commands
npm start                # Start with current .env
npm run reset            # Start with cache clear
npm test                 # Run tests
```

## Documentation

For detailed setup instructions, see:
- [Environment Setup Guide](./ENVIRONMENT-SETUP.md) - Complete setup instructions
- [OAuth Configuration Guide](./OAUTH-CONFIGURATION.md) - OAuth implementation details
- [Social Login Plan](./SOCIAL-LOGIN-PLAN.md) - Feature overview

## Support

If you encounter issues:
1. Check [ENVIRONMENT-SETUP.md](./ENVIRONMENT-SETUP.md) troubleshooting section
2. Verify all required variables are set
3. Clear cache and restart: `expo start -c`
4. Check provider console configurations match `.env`
