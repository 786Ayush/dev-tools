"use client";

import { useMemo, useState } from "react";
import ToolCard from "@/components/tool-card";
import { getToolCategories, tools } from "@/lib/tool-registry";

export default function ToolsDirectoryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesCategory = category === "All" || tool.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        tool.name.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery) ||
        tool.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.16em] text-cyan-300">Tool directory</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Search developer tools</h1>
      </div>

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:flex-row md:items-center">
        <input
          aria-label="Search tools"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by tool name or functionality..."
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-500"
        />

        <select
          aria-label="Filter by category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
        >
          <option value="All">All categories</option>
          {getToolCategories().map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      {filteredTools.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center">
          <p className="text-lg font-medium text-white">No tools match your search.</p>
          <p className="mt-2 text-sm text-slate-400">Try a different keyword or switch to another category.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
