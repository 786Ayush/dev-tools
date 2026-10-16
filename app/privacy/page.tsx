import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for AllToolHub browser-based developer utilities that process data locally in the browser.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Policy | AllToolHub", url: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Privacy Policy</h1>
      <div className="mt-8 space-y-6 text-slate-300">
        <p>
          Most supported tools process user input directly in the browser. This means data such as JSON, JWTs, CSV content, SQL strings, and regex input is not intentionally transmitted to a server for normal tool execution.
        </p>
        <p>
          The service may still use standard hosting and analytics infrastructure required for a website, but it should not capture or store the content users paste into developer utilities.
        </p>
        <p>
          Users should not paste production credentials, sensitive tokens, or confidential payloads into public browser-based tools unless they understand the privacy and security risks.
        </p>
      </div>
    </div>
  );
}
