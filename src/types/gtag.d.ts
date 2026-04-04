interface GtagConsentParams {
  analytics_storage?: "granted" | "denied";
  ad_storage?: "granted" | "denied";
  ad_user_data?: "granted" | "denied";
  ad_personalization?: "granted" | "denied";
}

interface Window {
  gtag: (command: string, ...args: unknown[]) => void;
  dataLayer: unknown[];
}
