"use client";

import { useState } from "react";
import { AlertTriangle, Check, Copy, ShieldAlert } from "lucide-react";
import { decodeJwt } from "@/lib/tool-utils";

const sampleToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDAwMDB9.1mS80iZ0A8QpQ6z3rCNs0Q2nWQXMi8n4d6YEhP3C3sM";

export default function JwtDecoderTool() {
  const [token, setToken] = useState(sampleToken);
  const [result, setResult] = useState(() => decodeJwt(sampleToken));
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleDecode = () => {
    const decoded = decodeJwt(token);
    if (!decoded.ok) {
      setError(decoded.error ?? "Unable to decode the token.");
      setResult({ ok: false, error: decoded.error ?? "Unable to decode the token." });
      return;
    }
    setError("");
    setResult(decoded);
  };

  const handleCopy = async () => {
    if (!result.ok || !result.payload) {
      return;
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(result.payload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Unable to copy the payload. Please copy it manually.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-300">
            <ShieldAlert className="h-4 w-4" />
            <span className="text-sm font-medium">JWT</span>
          </div>
          <button type="button" onClick={() => setToken(sampleToken)} className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-cyan-500">
            Load example
          </button>
        </div>

        <textarea
          aria-label="JWT input"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          className="h-[240px] w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-cyan-500"
          placeholder="Paste a JWT here..."
        />

        <button type="button" onClick={handleDecode} className="mt-4 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400">
          Decode token
        </button>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-cyan-300">Decoded output</span>
          {result.ok ? (
            <button type="button" onClick={handleCopy} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-cyan-500">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy payload"}
            </button>
          ) : null}
        </div>

        {error ? (
          <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : null}

        {result.ok ? (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium text-slate-200">Header</h3>
              <pre className="overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-100">
                {JSON.stringify(result.header, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-slate-200">Payload</h3>
              <pre className="overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-100">
                {JSON.stringify(result.payload, null, 2)}
              </pre>
            </div>
            {result.expiresAt ? (
              <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-3 text-sm text-cyan-100">
                Expires at: {new Date(result.expiresAt).toString()}
              </div>
            ) : null}
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
              Decoding a JWT does not verify its signature. Never assume the token is authentic or safe to trust.
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
