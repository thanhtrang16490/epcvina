/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CRM_LEAD_ENDPOINT?: string;
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly PUBLIC_APP_URL: string;
  readonly PUBLIC_API_URL: string;
  readonly PUBLIC_GOOGLE_ANALYTICS_ID?: string;
  readonly PUBLIC_GOOGLE_ADS_ID?: string;
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_META_PIXEL_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Google Analytics gtag type declaration
interface Window {
  gtag?: (...args: any[]) => void;
  fbq?: (...args: any[]) => void;
}
