import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/70">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-slate-300 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-base font-semibold text-white">AllToolHub</h3>
          <p className="mt-3 max-w-xs text-slate-400">
            AllToolHub: browser-first utilities for formatting, decoding, testing, and transforming common developer data.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Tools</h4>
          <ul className="mt-3 space-y-2">
            <li><Link href="/tools/json-formatter">JSON formatter</Link></li>
            <li><Link href="/tools/jwt-decoder">JWT decoder</Link></li>
            <li><Link href="/tools/cron-generator">Cron generator</Link></li>
            <li><Link href="/tools/csv-to-json">CSV to JSON</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Company</h4>
          <ul className="mt-3 space-y-2">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Resources</h4>
          <ul className="mt-3 space-y-2">
            <li><Link href="/tools">Tool directory</Link></li>
            <li><Link href="/tools/regex-tester">Regex tester</Link></li>
            <li><Link href="/tools/sql-formatter">SQL formatter</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
