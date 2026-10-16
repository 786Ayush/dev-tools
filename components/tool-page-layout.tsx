import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getToolBySlug, type ToolDefinition } from "@/lib/tool-registry";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://alltoolhub.vercel.app";
}

export default function ToolPageLayout({
  tool,
  children,
}: {
  tool: ToolDefinition;
  children: React.ReactNode;
}) {
  const baseUrl = getBaseUrl();
  const toolUrl = `${baseUrl}/tools/${tool.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${baseUrl}/tools` },
      { "@type": "ListItem", position: 3, name: tool.name, item: toolUrl },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.seo.description,
    url: toolUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
  };

  const relatedTools = tool.related
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolDefinition => Boolean(t));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

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

      {relatedTools.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold text-white">Related tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((related) => (
              <Link
                key={related.slug}
                href={`/tools/${related.slug}`}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-cyan-500/50"
              >
                <h3 className="text-base font-semibold text-white">{related.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{related.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
