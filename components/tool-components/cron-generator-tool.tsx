"use client";

import { useState } from "react";
import { AlertTriangle, Clock3, Copy, RotateCcw } from "lucide-react";
import { buildCronExpression } from "@/lib/tool-utils";

const defaultConfig = {
  minute: "*/15",
  hour: "*",
  dayOfMonth: "*",
  month: "*",
  dayOfWeek: "*",
};

const fieldLabels: Record<keyof typeof defaultConfig, string> = {
  minute: "Minute",
  hour: "Hour",
  dayOfMonth: "Day of month",
  month: "Month",
  dayOfWeek: "Day of week",
};

export default function CronGeneratorTool() {
  const [config, setConfig] = useState(defaultConfig);
  const [result, setResult] = useState(() => buildCronExpression(defaultConfig));

  const updateField = (field: keyof typeof defaultConfig, value: string) => {
    const next = { ...config, [field]: value };
    setConfig(next);
    setResult(buildCronExpression(next));
  };

  const handlePreset = (preset: keyof typeof presets) => {
    const next = presets[preset];
    setConfig(next);
    setResult(buildCronExpression(next));
  };

  const copyExpression = async () => {
    try {
      await navigator.clipboard.writeText(result.expression);
    } catch {
      // copy failures are silently ignored in tool interactions
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-4 flex items-center gap-2 text-cyan-300">
          <Clock3 className="h-4 w-4" />
          <span className="text-sm font-medium">Schedule configuration</span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {Object.keys(presets).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePreset(preset as keyof typeof presets)}
              className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-cyan-500"
            >
              {preset}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(config).map(([field, value]) => (
            <label key={field} className="block text-sm text-slate-200">
              <span className="mb-2 block">{fieldLabels[field as keyof typeof defaultConfig]}</span>
              <input
                value={value}
                onChange={(event) => updateField(field as keyof typeof defaultConfig, event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={copyExpression} className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400">
            <Copy className="h-4 w-4" />
            Copy expression
          </button>
          <button type="button" onClick={() => { setConfig(defaultConfig); setResult(buildCronExpression(defaultConfig)); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 hover:border-cyan-500">
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 text-sm font-medium text-cyan-300">Generated expression</div>
        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-lg text-cyan-200">{result.expression}</div>
        <div className="mt-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-3 text-sm text-cyan-100">
          {result.description}
        </div>
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
          This tool supports the standard five-field cron pattern: minute hour day-of-month month day-of-week.
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4" />
          <span>Supported expressions are validated for this plain standard cron format and may not match all platform-specific variants.</span>
        </div>
      </section>
    </div>
  );
}

const presets = {
  Hourly: { minute: "0", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
  Daily: { minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
  Weekly: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1" },
  Monthly: { minute: "0", hour: "0", dayOfMonth: "1", month: "*", dayOfWeek: "*" },
  "Every minute": { minute: "*", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
};
