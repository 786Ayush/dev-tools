import Papa from "papaparse";
import { format as formatSql } from "sql-formatter";
import cronstrue from "cronstrue";

export function formatJsonValue(input: string, minify = false) {
  if (!input.trim()) {
    return { ok: false, error: "Please provide JSON input to format." };
  }

  try {
    const parsed = JSON.parse(input);
    return {
      ok: true,
      value: JSON.stringify(parsed, null, minify ? 0 : 2),
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? `Invalid JSON: ${error.message}`
          : "Invalid JSON: the input could not be parsed.",
    };
  }
}

export function decodeJwt(token: string) {
  const trimmed = token.trim();

  if (!trimmed) {
    return {
      ok: false,
      error: "Please enter a JWT to decode.",
    };
  }

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return {
      ok: false,
      error: "This does not look like a valid JWT. A JWT has three Base64URL sections separated by periods.",
    };
  }

  const decodeSegment = (segment: string) => {
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (normalized.length % 4)) % 4;
    const padded = normalized + "=".repeat(padLength);

    if (typeof window !== "undefined" && typeof window.atob === "function") {
      return window.atob(padded);
    }

    if (typeof Buffer !== "undefined") {
      return Buffer.from(padded, "base64").toString("utf8");
    }

    throw new Error("Base64URL decoding is not available in this environment.");
  };

  try {
    const header = JSON.parse(decodeSegment(parts[0]));
    const payload = JSON.parse(decodeSegment(parts[1]));
    const expiresAt =
      typeof payload.exp === "number"
        ? new Date(payload.exp * 1000).toISOString()
        : typeof payload.exp === "string" && /^\d+$/.test(payload.exp)
          ? new Date(Number(payload.exp) * 1000).toISOString()
          : null;

    return {
      ok: true,
      header,
      payload,
      expiresAt,
      token: trimmed,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? `Unable to decode the token: ${error.message}`
          : "Unable to decode the token because the Base64URL content is malformed.",
    };
  }
}

export function buildCronExpression(config: {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}) {
  const expression = `${config.minute} ${config.hour} ${config.dayOfMonth} ${config.month} ${config.dayOfWeek}`;
  const description = (() => {
    try {
      return cronstrue.toString(expression);
    } catch {
      return "Unable to generate a description for this expression.";
    }
  })();

  return { expression, description };
}

export function runRegexTest(pattern: string, flags: string, text: string) {
  if (!pattern) {
    return { ok: false, error: "Please add a regex pattern to test." };
  }

  try {
    const regex = new RegExp(pattern, flags);
    const matches = Array.from(text.matchAll(regex));
    return {
      ok: true,
      matchCount: matches.length,
      matches: matches.map((match) => match[0]),
      groups: matches.map((match) => match.slice(1)),
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? `Invalid regular expression: ${error.message}`
          : "Invalid regular expression.",
    };
  }
}

export function convertCsvToJson(csv: string, delimiter: string, hasHeaders: boolean) {
  if (!csv.trim()) {
    return { ok: false, error: "Please provide CSV input to convert." };
  }

  const parseResult = Papa.parse<Record<string, string>>(csv, {
    delimiter,
    header: hasHeaders,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });

  if (parseResult.errors.length > 0) {
    const firstError = parseResult.errors[0];
    return {
      ok: false,
      error: firstError.message,
    };
  }

  return {
    ok: true,
    value: JSON.stringify(parseResult.data, null, 2),
  };
}

export function formatSqlString(sql: string) {
  if (!sql.trim()) {
    return { ok: false, error: "Please provide SQL to format." };
  }

  try {
    return {
      ok: true,
      value: formatSql(sql, {
        language: "sql",
        tabWidth: 2,
        keywordCase: "upper",
      }),
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? `Unable to format SQL: ${error.message}`
          : "Unable to format SQL because the query could not be parsed.",
    };
  }
}
