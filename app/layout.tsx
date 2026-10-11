import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Free Online Developer Tools",
    template: "%s | Free Online Developer Tools",
  },
  description:
    "Format, validate, decode, and transform common developer data with fast, privacy-friendly browser utilities.",
  keywords: [
    "developer tools",
    "JSON formatter",
    "JWT decoder",
    "cron generator",
    "regex tester",
    "CSV to JSON",
    "SQL formatter",
  ],
  openGraph: {
    title: "Free Online Developer Tools",
    description:
      "Fast, browser-based developer utilities for JSON, JWTs, CSV, cron, regex, and SQL.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <div className="relative min-h-screen">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
          <SiteHeader />
          <main className="relative z-10">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
