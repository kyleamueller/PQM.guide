import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import AppShell from "@/components/layout/AppShell";
import { buildSearchIndex } from "@/lib/mdx";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PQM.guide - Power Query M Function Reference",
    template: "%s | PQM.guide",
  },
  description:
    "Community-driven Power Query M language reference with visual table examples. Better than the official docs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const functions = buildSearchIndex();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <AppShell functions={functions}>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
