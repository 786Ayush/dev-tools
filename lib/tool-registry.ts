export type ToolCategory =
  | "Formatting"
  | "Security"
  | "Automation"
  | "Data"
  | "Database";

export type ToolDefinition = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  featured: boolean;
  related: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

export const tools: ToolDefinition[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter and Validator",
    slug: "json-formatter",
    description: "Format, pretty-print, minify, and validate JSON before shipping it to APIs or scripts.",
    category: "Formatting",
    keywords: ["json", "formatter", "validator", "pretty print", "minify"],
    featured: true,
    related: ["jwt-decoder", "csv-to-json", "sql-formatter"],
    seo: {
      title: "JSON Formatter and Validator",
      description: "Format, validate, and minify JSON safely in your browser with a fast, privacy-friendly JSON formatter.",
      keywords: ["JSON formatter", "JSON validator", "pretty print JSON", "minify JSON"],
    },
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    slug: "jwt-decoder",
    description: "Decode JWT headers and payloads to inspect claims without verifying signatures.",
    category: "Security",
    keywords: ["jwt", "decode", "token", "header", "payload"],
    featured: true,
    related: ["json-formatter", "regex-tester"],
    seo: {
      title: "JWT Decoder",
      description: "Decode JWT headers and payloads safely in the browser to inspect standard claims and token structure.",
      keywords: ["JWT decoder", "decode JWT", "JWT header", "JWT payload"],
    },
  },
  {
    id: "cron-generator",
    name: "Cron Expression Generator",
    slug: "cron-generator",
    description: "Generate and validate cron syntax for common schedules with quick presets and plain-English descriptions.",
    category: "Automation",
    keywords: ["cron", "schedule", "expression", "generator", "every hour"],
    featured: true,
    related: ["regex-tester", "sql-formatter"],
    seo: {
      title: "Cron Expression Generator",
      description: "Generate cron expressions and read the meaning of common schedules in a browser-based cron generator.",
      keywords: ["cron expression generator", "cron syntax", "cron schedule examples"],
    },
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    slug: "regex-tester",
    description: "Test patterns, inspect matches, and catch invalid regular expressions without risking client-side code execution.",
    category: "Formatting",
    keywords: ["regex", "regular expression", "pattern", "match", "tester"],
    featured: true,
    related: ["json-formatter", "cron-generator"],
    seo: {
      title: "Regex Tester",
      description: "Test JavaScript regular expressions against sample text, view matches, and understand common validation errors.",
      keywords: ["regex tester", "regular expression tester", "regex examples"],
    },
  },
  {
    id: "csv-to-json",
    name: "CSV to JSON Converter",
    slug: "csv-to-json",
    description: "Convert CSV data into JSON arrays with delimiter control, quoting support, and header handling.",
    category: "Data",
    keywords: ["csv", "json", "convert", "parser", "delimiter"],
    featured: true,
    related: ["json-formatter", "sql-formatter"],
    seo: {
      title: "CSV to JSON Converter",
      description: "Convert CSV to JSON in the browser with delimiter selection, headers, and proper quoting support.",
      keywords: ["CSV to JSON", "convert CSV to JSON", "CSV parser"],
    },
  },
  {
    id: "sql-formatter",
    name: "SQL Query Formatter",
    slug: "sql-formatter",
    description: "Beautify SQL statements, improve readability, and prepare queries for review or documentation.",
    category: "Database",
    keywords: ["sql", "formatter", "beautifier", "database", "query"],
    featured: true,
    related: ["json-formatter", "csv-to-json"],
    seo: {
      title: "SQL Formatter",
      description: "Format SQL queries for readability with a browser-based SQL formatter that never executes database queries.",
      keywords: ["SQL formatter", "format SQL query", "SQL beautifier"],
    },
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolCategories(): ToolCategory[] {
  return Array.from(new Set(tools.map((tool) => tool.category)));
}
