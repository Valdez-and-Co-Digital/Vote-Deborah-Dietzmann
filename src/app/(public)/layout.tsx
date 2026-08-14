import type { Metadata } from "next";
import "../globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.deborahdietzmannforjudge.com"),
  title: "Deborah Dietzmann for Judge | County Court 12",
  description: "Official campaign website for Deborah Dietzmann, candidate for Bexar County Court at Law No. 12. Over 25 years of criminal trial experience.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "Deborah Dietzmann for Judge",
    url: "https://www.deborahdietzmannforjudge.com",
    title: "Deborah Dietzmann for Judge | County Court 12",
    description: "Official campaign website for Deborah Dietzmann, candidate for Bexar County Court at Law No. 12. Over 25 years of criminal trial experience.",
    locale: "en_US",
    type: "website",
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&family=Montserrat:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {/* Google Consent Mode Default */}
        <Script
          id="google-consent-mode"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
              });
            `,
          }}
        />
        {/* Google Analytics 4 */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-D8HWW7QQRD`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-D8HWW7QQRD', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        <Navigation />
        <main>
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
