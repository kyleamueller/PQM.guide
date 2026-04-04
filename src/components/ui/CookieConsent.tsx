"use client";

import { useState, useEffect } from "react";
import {
  hasConsentBeenGiven,
  setStoredConsent,
  clearStoredConsent,
  updateGtagConsent,
} from "@/lib/consent";

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!hasConsentBeenGiven()) {
      setVisible(true);
    }

    function handleResetConsent() {
      clearStoredConsent();
      setHiding(false);
      setVisible(true);
    }

    window.addEventListener("pqm:reset-consent", handleResetConsent);
    return () => window.removeEventListener("pqm:reset-consent", handleResetConsent);
  }, []);

  if (!mounted || !visible) return null;

  function handleChoice(consent: "granted" | "denied") {
    setStoredConsent(consent);
    updateGtagConsent(consent === "granted");
    setHiding(true);
    setTimeout(() => setVisible(false), 200);
  }

  return (
    <div
      className={`cookie-consent-banner${hiding ? " cookie-consent-banner--hiding" : ""}`}
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      <p className="cookie-consent-text">
        This site uses Google Analytics cookies to understand how visitors use
        the site and help improve content. You can accept or decline.
      </p>
      <div className="cookie-consent-actions">
        <button
          className="cookie-consent-btn cookie-consent-btn--decline"
          onClick={() => handleChoice("denied")}
        >
          Decline
        </button>
        <button
          className="cookie-consent-btn cookie-consent-btn--accept"
          onClick={() => handleChoice("granted")}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
