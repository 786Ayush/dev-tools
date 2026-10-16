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

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://alltoolhub.vercel.app";
}

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "AllToolHub: Private Developer Tools That Run in Your Browser",
    template: "%s | AllToolHub",
  },
  description:
    "JSON, JWT, cron, regex, CSV, and SQL tools that never upload your data. Free, no sign-up.",
  keywords: [
    "developer tools",
    "JSON formatter",
    "JWT decoder",
    "cron generator",
    "regex tester",
    "CSV to JSON",
    "SQL formatter",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AllToolHub: Private Developer Tools That Run in Your Browser",
    description:
      "JSON, JWT, cron, regex, CSV, and SQL tools that never upload your data. Free, no sign-up.",
    type: "website",
    url: "/",
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
