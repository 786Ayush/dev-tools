import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageLayout from "@/components/tool-page-layout";
import JsonFormatterTool from "@/components/tool-components/json-formatter-tool";
import JwtDecoderTool from "@/components/tool-components/jwt-decoder-tool";
import CronGeneratorTool from "@/components/tool-components/cron-generator-tool";
import RegexTesterTool from "@/components/tool-components/regex-tester-tool";
import CsvToJsonTool from "@/components/tool-components/csv-to-json-tool";
import SqlFormatterTool from "@/components/tool-components/sql-formatter-tool";
import { getToolBySlug, tools } from "@/lib/tool-registry";

const toolComponentMap = {
  "json-formatter": JsonFormatterTool,
  "jwt-decoder": JwtDecoderTool,
  "cron-generator": CronGeneratorTool,
  "regex-tester": RegexTesterTool,
  "csv-to-json": CsvToJsonTool,
  "sql-formatter": SqlFormatterTool,
} as const;

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool not found",
    };
  }

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url: `/tools/${tool.slug}`,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const ToolComponent = toolComponentMap[tool.slug as keyof typeof toolComponentMap];

  if (!ToolComponent) {
    notFound();
  }

  return (
    <ToolPageLayout tool={tool}>
      <ToolComponent />
    </ToolPageLayout>
  );
}
