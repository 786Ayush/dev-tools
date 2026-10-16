import type { ReactNode, TextareaHTMLAttributes } from "react";
import { panelClass, preClass, textareaClass } from "./styles";

/** A titled card that holds an input or output area. Safe to render from server or client components. */
export function ToolPanel({
  title,
  titleId,
  actions,
  children,
  className = "",
}: {
  title: string;
  titleId?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={titleId} className={`${panelClass} min-w-0 ${className}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 id={titleId} className="text-sm font-medium text-cyan-300">
          {title}
        </h2>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

/** Two-column input/output layout that stacks on small screens. */
export function WorkspaceGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 lg:grid-cols-2">{children}</div>;
}

export function CodeTextarea({
  label,
  rows = 14,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <textarea
      aria-label={label}
      rows={rows}
      spellCheck={false}
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      className={`${textareaClass} ${className}`}
      {...props}
    />
  );
}

export function OutputBlock({ label, value, empty, className = "" }: { label: string; value: string; empty?: string; className?: string }) {
  if (!value) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
        {empty ?? "Output will appear here."}
      </div>
    );
  }
  return (
    <pre aria-label={label} tabIndex={0} className={`${preClass} max-h-[32rem] ${className}`}>
      {value}
    </pre>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
      <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-400">{label}</dt>
      <dd className="mt-0.5 font-mono text-sm text-slate-100">{value}</dd>
    </div>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">{children}</dl>;
}
