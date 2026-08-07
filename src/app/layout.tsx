import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
        <Navigation />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
