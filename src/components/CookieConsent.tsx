"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "granted");
    setIsVisible(false);

    // Update Google Consent Mode
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "denied");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pb-safe animate-in slide-in-from-bottom-full duration-500 ease-out">
      <div className="max-w-5xl mx-auto backdrop-blur-md bg-primary/90 border border-outline-variant/30 shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-on-primary">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-heritage-gold">cookie</span>
            <h3 className="font-heading text-xl font-bold">We Value Your Privacy</h3>
          </div>
          <p className="text-sm md:text-base opacity-90 leading-relaxed font-body">
            We use cookies to improve your browsing experience and analyze site traffic. 
            By clicking "Accept", you consent to our use of cookies as described in our{" "}
            <Link href="/privacy-policy" className="underline text-heritage-gold hover:text-white transition-colors">
              Privacy Policy
            </Link>.
          </p>
        </div>
        <div className="flex flex-row gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={handleDecline}
            className="flex-1 md:flex-none px-6 py-3 rounded-full border border-outline-variant/50 text-on-primary font-medium hover:bg-white/10 transition-colors duration-200"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 md:flex-none px-6 py-3 rounded-full bg-secondary hover:bg-secondary-container text-on-secondary font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// Add TypeScript declaration for window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
