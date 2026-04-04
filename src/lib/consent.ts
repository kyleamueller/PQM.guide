const CONSENT_STORAGE_KEY = "pqm-cookie-consent";

export interface ConsentState {
  consent: "granted" | "denied";
  timestamp: number;
}

export function getStoredConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.consent === "granted" || parsed.consent === "denied") {
      return parsed as ConsentState;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredConsent(consent: "granted" | "denied"): void {
  try {
    const state: ConsentState = { consent, timestamp: Date.now() };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (e.g. incognito Safari)
  }
}

export function clearStoredConsent(): void {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}

export function hasConsentBeenGiven(): boolean {
  return getStoredConsent() !== null;
}

export function updateGtagConsent(granted: boolean): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  }
}
