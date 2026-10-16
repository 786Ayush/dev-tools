import type { Metadata } from "next";
import ToolsDirectoryClient from "./tools-directory-client";

export const metadata: Metadata = {
  title: "All Developer Tools",
  description:
    "Browse every AllToolHub utility: JSON formatter, JWT decoder, cron generator, regex tester, CSV to JSON, SQL formatter. All run in your browser.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "All Developer Tools | AllToolHub",
    url: "/tools",
  },
};

export default function ToolsDirectoryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.16em] text-cyan-300">Tool directory</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">All developer tools</h1>
      </div>
      <ToolsDirectoryClient />
    </div>
  );
}
