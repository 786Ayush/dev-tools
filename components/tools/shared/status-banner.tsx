import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

export type BannerTone = "error" | "warning" | "success" | "info";

const toneClass: Record<BannerTone, string> = {
  // The site's light theme is html:not(.dark); these variants keep text readable there.
  error: "border-red-500/40 bg-red-500/10 text-red-200 [html:not(.dark)_&]:text-red-800",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-100 [html:not(.dark)_&]:text-amber-800",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100 [html:not(.dark)_&]:text-emerald-800",
  info: "border-cyan-500/40 bg-cyan-500/10 text-cyan-100 [html:not(.dark)_&]:text-cyan-800",
};

const toneIcon: Record<BannerTone, typeof Info> = {
  error: XCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
};

export default function StatusBanner({ tone, title, children }: { tone: BannerTone; title?: string; children?: ReactNode }) {
  const Icon = toneIcon[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${toneClass[tone]}`}
    >
      <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 space-y-1">
        {title ? <p className="font-medium">{title}</p> : null}
        {children ? <div className="break-words">{children}</div> : null}
      </div>
    </div>
  );
}

/** Renders a list of non-fatal warnings, or nothing when the list is empty. */
export function WarningList({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) {
    return null;
  }
  return (
    <StatusBanner tone="warning" title={warnings.length === 1 ? "1 warning" : `${warnings.length} warnings`}>
      <ul className="list-disc space-y-1 pl-4">
        {warnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
    </StatusBanner>
  );
}
