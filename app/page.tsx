import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Search } from "lucide-react";
import { tools, type ToolDefinition } from "@/lib/tool-registry";
import ToolCard from "@/components/tool-card";

const featuredTools = tools.filter((tool) => tool.featured);

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20 sm:p-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Fast browser-based utilities
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Free Online Developer Tools
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Format, validate, decode, and transform data with fast, privacy-friendly tools that work right in your browser.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
              >
                Explore tools
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#popular-tools"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-medium text-slate-100 transition hover:border-slate-500"
              >
                Popular tools
              </Link>
            </div>
          </div>

          <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-950/70 p-4 shadow-lg shadow-slate-950/40">
            <label htmlFor="tool-search" className="sr-only">Search developer tools</label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                id="tool-search"
                type="search"
                placeholder="Search developer tools..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                readOnly
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {featuredTools.slice(0, 4).map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-500/50 hover:bg-slate-800"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="popular-tools" className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Popular tools</h2>
          <Link href="/tools" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">
            View directory
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredTools.map((tool: ToolDefinition) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        {[
          { title: "Built for developers", text: "Every tool is designed to handle everyday debugging, data cleanup, and validation workflows." },
          { title: "No account required", text: "Use the core utilities immediately without creating an account or submitting data to a backend." },
          { title: "Private by default", text: "Most tool processing happens in the browser, keeping sensitive JSON, CSV, and JWT content local." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center gap-3 text-cyan-300">
          <ShieldCheck className="h-5 w-5" />
          <h2 className="text-xl font-semibold text-white">Privacy-first processing</h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Supported tools process data locally in your browser to reduce latency and avoid sending inputs to a server. This keeps JSON, JWTs, CSV content, and SQL queries private while you work.
        </p>
      </section>
    </div>
  );
}
