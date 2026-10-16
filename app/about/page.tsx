import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About AllToolHub",
  description: "Learn more about AllToolHub and the privacy-first, browser-based utility approach.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About AllToolHub", url: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">About AllToolHub</h1>
      <p className="mt-4 text-lg text-slate-300">
        AllToolHub is a browser-first collection of utilities designed for common engineering workflows. The platform aims to keep tasks simple, private, and fast by processing data locally whenever possible.
      </p>
      <div className="mt-8 space-y-6 text-slate-300">
        <p>
          We focus on tools developers actually reach for while debugging: JSON formatting, JWT inspection, regex testing, cron generation, CSV conversion, and SQL cleanup.
        </p>
        <p>
          The product intentionally avoids a traditional backend for core utilities so that data stays in the browser and launches remain lightweight, secure, and easy to maintain.
        </p>
      </div>
    </div>
  );
}
