import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import AppShell from "@/components/layout/AppShell";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import CookieConsent from "@/components/ui/CookieConsent";
import { buildSearchIndex, buildUnifiedSearchIndex } from "@/lib/mdx";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PQM.guide - Power Query M Function Reference",
    template: "%s | PQM.guide",
  },
  description:
    "Community-driven Power Query M language reference with visual table examples. Better than the official docs.",
  metadataBase: new URL("https://pqm.guide"),
  openGraph: {
    siteName: "PQM.guide",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PQM.guide",
  url: "https://pqm.guide",
  description:
    "Community-driven Power Query M language reference with visual table examples.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://pqm.guide/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const functions = buildSearchIndex();
  const searchItems = buildUnifiedSearchIndex();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
              });
            `,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <GoogleAnalytics />
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <AppShell functions={functions} searchItems={searchItems}>{children}</AppShell>
        </ThemeProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
