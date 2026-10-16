import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for AllToolHub browser-based developer utilities.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms of Use | AllToolHub", url: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Terms of Use</h1>
      <div className="mt-8 space-y-6 text-slate-300">
        <p>
          This website provides developer tools for free educational and productivity use. The tools are intended to assist with debugging, tuning, and converting common data formats.
        </p>
        <p>
          Users are responsible for validating the correctness of outputs and for using the tools in a lawful and secure manner. The service does not guarantee that every generated result is appropriate for a production system.
        </p>
        <p>
          The platform may change or add utilities over time. Tools should not be treated as a substitute for formal validation, security review, or production operational control.
        </p>
      </div>
    </div>
  );
}
