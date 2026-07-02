/**
 * Expo App Configuration
 * 
 * Loads environment variables and merges with app.json configuration
 */

// Load environment variables from .env file
require('dotenv').config()

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      // OAuth Configuration - Google
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
      GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID || '',
      GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID || '',
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '',
      
      // OAuth Configuration - Facebook
      FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '',
      FACEBOOK_REDIRECT_URI: process.env.FACEBOOK_REDIRECT_URI || '',
      
      // OAuth Configuration - Zalo
      ZALO_APP_ID: process.env.ZALO_APP_ID || '',
      ZALO_APP_SECRET: process.env.ZALO_APP_SECRET || '',
      ZALO_REDIRECT_URI: process.env.ZALO_REDIRECT_URI || '',
    },
  }
}
