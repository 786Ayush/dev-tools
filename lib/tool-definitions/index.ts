import type { ToolDefinition } from "@/lib/tool-registry";
import { cronTools } from "./cron";
import { dataTools } from "./data";
import { databaseTools } from "./database";
import { dateTimeTools } from "./date-time";
import { encodingTools } from "./encoding";
import { filesTools } from "./files";
import { formattingTools } from "./formatting";
import { numberColorTools } from "./number-color";
import { regexTools } from "./regex";
import { textTools } from "./text";
import { webTools } from "./web";

/** Tools added after the original six. Appended to `tools` in lib/tool-registry.ts. */
export const additionalTools: ToolDefinition[] = [
  ...encodingTools,
  ...webTools,
  ...cronTools,
  ...regexTools,
  ...dataTools,
  ...formattingTools,
  ...filesTools,
  ...databaseTools,
  ...textTools,
  ...dateTimeTools,
  ...numberColorTools,
];
