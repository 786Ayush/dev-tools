import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { ToolDefinition } from "@/lib/tool-registry";

export default function ToolPageLayout({
  tool,
  children,
}: {
  tool: ToolDefinition;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-cyan-300">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/tools" className="hover:text-cyan-300">Tools</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-200">{tool.name}</span>
      </nav>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">{tool.category}</p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{tool.name}</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300">{tool.description}</p>
        </div>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-500 hover:text-cyan-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tools
        </Link>
      </div>

      {children}
    </div>
  );
}
