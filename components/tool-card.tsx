import Link from "next/link";
import { ArrowUpRight, Braces, Clock3, Database, FileText, ShieldCheck } from "lucide-react";
import type { ToolDefinition } from "@/lib/tool-registry";

const iconMap = {
  "json-formatter": Braces,
  "jwt-decoder": ShieldCheck,
  "cron-generator": Clock3,
  "regex-tester": FileText,
  "csv-to-json": Database,
  "sql-formatter": Braces,
};

export default function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = iconMap[tool.slug as keyof typeof iconMap] ?? FileText;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-500/50 hover:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-cyan-300">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-cyan-300" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
        <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-300">
          {tool.category}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-300">{tool.description}</p>
    </Link>
  );
}
