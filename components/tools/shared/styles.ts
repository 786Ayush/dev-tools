/**
 * Shared class strings. They intentionally use the slate/cyan classes that globals.css
 * remaps for light mode, so new components follow the theme without extra CSS.
 */
export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

export const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus-visible:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500/40";

export const textareaClass =
  "block w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 placeholder:text-slate-500 outline-none focus-visible:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500/40";

export const panelClass = "rounded-2xl border border-slate-800 bg-slate-900/60 p-4";

export const preClass =
  "overflow-auto whitespace-pre-wrap break-words rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100";

export const labelClass = "text-sm font-medium text-slate-200";
