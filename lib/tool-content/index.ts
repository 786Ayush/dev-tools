import type { ToolContent } from "./types";
import { cronContent } from "./cron";
import { dataContent } from "./data";
import { databaseContent } from "./database";
import { dateTimeContent } from "./date-time";
import { encodingContent } from "./encoding";
import { filesContent } from "./files";
import { formattingContent } from "./formatting";
import { numberColorContent } from "./number-color";
import { regexContent } from "./regex";
import { textContent } from "./text";
import { webContent } from "./web";

const contentBySlug: Record<string, ToolContent> = {
  ...encodingContent,
  ...webContent,
  ...cronContent,
  ...regexContent,
  ...dataContent,
  ...formattingContent,
  ...filesContent,
  ...databaseContent,
  ...textContent,
  ...dateTimeContent,
  ...numberColorContent,
};

export function getToolContent(slug: string): ToolContent | undefined {
  return contentBySlug[slug];
}
