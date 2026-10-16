"use client";

import { cronRenderers } from "./renderers/cron";
import { dataRenderers } from "./renderers/data";
import { databaseRenderers } from "./renderers/database";
import { dateTimeRenderers } from "./renderers/date-time";
import { encodingRenderers } from "./renderers/encoding";
import { filesRenderers } from "./renderers/files";
import { formattingRenderers } from "./renderers/formatting";
import { numberColorRenderers } from "./renderers/number-color";
import { regexRenderers } from "./renderers/regex";
import { textRenderers } from "./renderers/text";
import { webRenderers } from "./renderers/web";
import type { ToolRendererMap } from "./renderers/types";

const renderers: ToolRendererMap = {
  ...encodingRenderers,
  ...webRenderers,
  ...cronRenderers,
  ...regexRenderers,
  ...dataRenderers,
  ...formattingRenderers,
  ...filesRenderers,
  ...databaseRenderers,
  ...textRenderers,
  ...dateTimeRenderers,
  ...numberColorRenderers,
};

/**
 * Renders tools added after the original six. Each workspace is its own next/dynamic chunk,
 * so a tool page downloads only its own code. This must be a Client Component: dynamic
 * imports from a Server Component are not code-split.
 */
export default function NewToolRenderer({ slug }: { slug: string }) {
  const Workspace = renderers[slug];
  if (!Workspace) {
    return (
      <p role="alert" className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-300">
        This tool is not available yet.
      </p>
    );
  }
  return <Workspace />;
}
