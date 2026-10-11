"use client";

import { useState } from "react";
import { AlertTriangle, Copy, Download, FileSpreadsheet } from "lucide-react";
import { convertCsvToJson } from "@/lib/tool-utils";

const sampleCsv = `name,email,role\nAva,ava@example.com,admin\nNoah,noah@example.com,developer\nMila,mila@example.com,designer`;

export default function CsvToJsonTool() {
  const [input, setInput] = useState(sampleCsv);
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeaders, setHasHeaders] = useState(true);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleConvert = () => {
    const result = convertCsvToJson(input, delimiter, hasHeaders);
    if (!result.ok) {
      setError(result.error ?? "Unable to parse CSV input.");
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
      setError("Unable to copy the JSON output.");
    }
  };

  const handleDownload = () => {
    if (!output) {
      return;
    }

    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "converted.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-300">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="text-sm font-medium">CSV input</span>
          </div>
          <button type="button" onClick={() => setInput(sampleCsv)} className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-cyan-500">
            Load example
          </button>
        </div>

        <div className="mb-4 flex gap-3">
          <label className="text-sm text-slate-200">
            <span className="mb-2 block">Delimiter</span>
            <select value={delimiter} onChange={(event) => setDelimiter(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500">
              <option value=",">Comma</option>
              <option value=";">Semicolon</option>
              <option value="\t">Tab</option>
            </select>
          </label>

          <label className="flex items-end gap-2 text-sm text-slate-200">
            <input type="checkbox" checked={hasHeaders} onChange={() => setHasHeaders((value) => !value)} />
            <span>Use headers</span>
          </label>
        </div>

        <textarea
          aria-label="CSV input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="h-[320px] w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-cyan-500"
          placeholder="Paste CSV here..."
        />

        <button type="button" onClick={handleConvert} className="mt-4 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400">
          Convert to JSON
        </button>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-cyan-300">JSON output</span>
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
          {output || "Converted JSON will appear here."}
        </pre>
      </section>
    </div>
  );
}
