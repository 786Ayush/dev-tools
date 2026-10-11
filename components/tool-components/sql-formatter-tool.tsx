"use client";

import { useState } from "react";
import { AlertTriangle, Copy, Database, Download } from "lucide-react";
import { formatSqlString } from "@/lib/tool-utils";

const sampleSql = `SELECT users.id, users.name, orders.total
FROM users
JOIN orders ON users.id = orders.user_id
WHERE users.is_active = true
ORDER BY orders.created_at DESC
LIMIT 20;`;

export default function SqlFormatterTool() {
  const [input, setInput] = useState(sampleSql);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleFormat = () => {
    const result = formatSqlString(input);
    if (!result.ok) {
      setError(result.error ?? "Unable to format SQL.");
      return;
    }
    setError("");
    setOutput(result.value ?? "");
  };

  const handleCopy = async () => {
    if (!output) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
    } catch {
      setError("Unable to copy SQL output.");
    }
  };

  const handleDownload = () => {
    if (!output) {
      return;
    }

    const blob = new Blob([output], { type: "text/sql" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "formatted.sql";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-300">
            <Database className="h-4 w-4" />
            <span className="text-sm font-medium">SQL input</span>
          </div>
          <button type="button" onClick={() => setInput(sampleSql)} className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-cyan-500">
            Load example
          </button>
        </div>

        <textarea
          aria-label="SQL input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="h-[320px] w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-cyan-500"
          placeholder="Paste SQL here..."
        />

        <button type="button" onClick={handleFormat} className="mt-4 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400">
          Format SQL
        </button>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-cyan-300">Formatted output</span>
          <div className="flex gap-2">
            <button type="button" onClick={handleCopy} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-cyan-500">
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
            <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-cyan-500">
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : null}

        <pre className="h-[320px] overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100">
          {output || "Formatted SQL will appear here."}
        </pre>
      </section>
    </div>
  );
}
