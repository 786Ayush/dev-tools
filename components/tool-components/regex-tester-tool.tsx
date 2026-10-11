"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Copy, Search, Sparkles } from "lucide-react";
import { runRegexTest } from "@/lib/tool-utils";

const sampleText = "Contact support@acme.dev or call +1 (415) 837-1100. User IDs: user_42, user_99.";
const samplePattern = "user_\\d+|support@acme\\.dev|\\+1";

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState(samplePattern);
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState(sampleText);

  const result = useMemo(() => runRegexTest(pattern, flags, text), [flags, pattern, text]);
  const captureGroups = result.ok ? result.groups ?? [] : [];

  const highlightedText = useMemo(() => {
    if (!pattern || !result.ok) {
      return [] as { text: string; match: boolean }[];
    }

    const regex = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
    const parts: { text: string; match: boolean }[] = [];
    let lastIndex = 0;

    for (const match of text.matchAll(regex)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;

      if (start > lastIndex) {
        parts.push({ text: text.slice(lastIndex, start), match: false });
      }
      parts.push({ text: match[0], match: true });
      lastIndex = end;
    }

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), match: false });
    }

    return parts;
  }, [flags, pattern, result.ok, text]);

  const copyPattern = async () => {
    try {
      await navigator.clipboard.writeText(pattern);
    } catch {
      // no-op
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-300">
            <Search className="h-4 w-4" />
            <span className="text-sm font-medium">Pattern</span>
          </div>
          <button type="button" onClick={() => { setPattern(samplePattern); setFlags("g"); setText(sampleText); }} className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-cyan-500">
            Load sample
          </button>
        </div>

        <div className="grid gap-4">
          <label className="block text-sm text-slate-200">
            <span className="mb-2 block">Pattern</span>
            <input
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              placeholder="Enter a regex pattern"
            />
          </label>

          <label className="block text-sm text-slate-200">
            <span className="mb-2 block">Flags</span>
            <input
              value={flags}
              onChange={(event) => setFlags(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              placeholder="e.g. g, i, m"
            />
          </label>

          <label className="block text-sm text-slate-200">
            <span className="mb-2 block">Text to test</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="h-[220px] w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-slate-100 outline-none focus:border-cyan-500"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-cyan-300">Results</span>
          <button type="button" onClick={copyPattern} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-cyan-500">
            <Copy className="h-3.5 w-3.5" />
            Copy pattern
          </button>
        </div>

        {result.ok ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200">
              Matches found: <span className="font-semibold text-cyan-300">{result.matchCount}</span>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm leading-7 text-slate-100">
              {highlightedText.length > 0 ? (
                highlightedText.map((part, index) =>
                  part.match ? (
                    <span key={`${part.text}-${index}`} className="rounded bg-cyan-500/20 px-1 text-cyan-200">
                      {part.text}
                    </span>
                  ) : (
                    <span key={`${part.text}-${index}`}>{part.text}</span>
                  ),
                )
              ) : (
                <span className="text-slate-400">No matches found.</span>
              )}
            </div>
            {captureGroups.length > 0 ? (
              <div>
                <h3 className="mb-2 text-sm font-medium text-slate-200">Capture groups</h3>
                <pre className="overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100">
                  {JSON.stringify(captureGroups, null, 2)}
                </pre>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <span>{result.error}</span>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
          <Sparkles className="h-4 w-4" />
          JavaScript regular expressions are used here; browser engine behavior may vary slightly from other runtimes.
        </div>
      </section>
    </div>
  );
}
