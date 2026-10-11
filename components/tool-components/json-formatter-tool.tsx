"use client";

import { useState } from "react";
import { AlertTriangle, Check, Copy, Download, FileJson, RotateCcw } from "lucide-react";
import { formatJsonValue } from "@/lib/tool-utils";

const sampleJson = JSON.stringify(
  {
    name: "developer-tools",
    version: "1.0.0",
    features: ["JSON validation", "JWT decode", "cron generation"],
    metadata: {
      environment: "browser",
      privacy: "local processing",
    },
  },
  null,
  2,
);

export default function JsonFormatterTool() {
  const [input, setInput] = useState(sampleJson);
  const [output, setOutput] = useState(sampleJson);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    const result = formatJsonValue(input, false);
    if (!result.ok) {
      setError(result.error ?? "Invalid JSON input.");
      return;
    }
    setOutput(result.value ?? "");
    setError("");
  };

  const handleMinify = () => {
    const result = formatJsonValue(input, true);
    if (!result.ok) {
      setError(result.error ?? "Invalid JSON input.");
      return;
    }
    setOutput(result.value ?? "");
    setError("");
  };

  const handleCopy = async () => {
    if (!output) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Unable to copy the output. Please copy it manually.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "formatted.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-300">
            <FileJson className="h-4 w-4" />
            <span className="text-sm font-medium">Input</span>
          </div>
          <button
            type="button"
            onClick={() => setInput("")}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-cyan-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
        <textarea
          aria-label="JSON input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="h-[360px] w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-cyan-500"
          placeholder="Paste JSON here..."
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={handleFormat} className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400">
            Format JSON
          </button>
          <button type="button" onClick={handleMinify} className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 hover:border-cyan-500">
            Minify JSON
          </button>
          <button type="button" onClick={() => setInput(sampleJson)} className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 hover:border-cyan-500">
            Load example
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-cyan-300">Output</span>
          <div className="flex gap-2">
            <button type="button" onClick={handleCopy} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-cyan-500">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
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

        <pre className="h-[360px] overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100">
          {output || "Formatted output will appear here."}
        </pre>
      </section>
    </div>
  );
}
