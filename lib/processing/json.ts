import { checkInputSize, errorMessage, fail, lineColumnAt, ok, type Result } from "./result";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type JsonIndent = "2" | "4" | "tab";

/** Parses JSON and reports the error position as line and column when the engine provides an offset. */
export function parseJson(input: string): Result<JsonValue> {
  if (!input.trim()) {
    return fail("Please provide JSON input.");
  }
  const tooLarge = checkInputSize(input);
  if (tooLarge) {
    return fail(tooLarge);
  }
  try {
    const value: JsonValue = JSON.parse(input);
    return ok(value);
  } catch (error) {
    const message = errorMessage(error, "The input could not be parsed.");
    // V8 messages include "at position N"; newer ones already add "(line X column Y)".
    const position = /at position (\d+)/.exec(message);
    if (position && !/line \d+/i.test(message)) {
      const { line, column } = lineColumnAt(input, Number(position[1]));
      return fail(`Invalid JSON: ${message} (line ${line}, column ${column})`);
    }
    return fail(`Invalid JSON: ${message}`);
  }
}

export function sortJsonKeys(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map(sortJsonKeys);
  }
  if (value !== null && typeof value === "object") {
    const sorted: { [key: string]: JsonValue } = {};
    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortJsonKeys(value[key]);
    }
    return sorted;
  }
  return value;
}

function containsUnsafeInteger(value: JsonValue): boolean {
  if (typeof value === "number") {
    return Number.isInteger(value) && !Number.isSafeInteger(value);
  }
  if (Array.isArray(value)) {
    return value.some(containsUnsafeInteger);
  }
  if (value !== null && typeof value === "object") {
    return Object.values(value).some(containsUnsafeInteger);
  }
  return false;
}

export function stringifyJson(value: JsonValue, indent: JsonIndent = "2"): string {
  return JSON.stringify(value, null, indent === "tab" ? "\t" : Number(indent));
}

export function formatJson(input: string, options: { minify?: boolean; indent?: JsonIndent; sortKeys?: boolean } = {}): Result<string> {
  const parsed = parseJson(input);
  if (!parsed.ok) {
    return parsed;
  }
  const value = options.sortKeys ? sortJsonKeys(parsed.value) : parsed.value;
  const warnings: string[] = [];
  if (containsUnsafeInteger(parsed.value)) {
    warnings.push("The input contains integers larger than 2^53. JavaScript cannot represent them exactly, so the output may differ from the input.");
  }
  return ok(options.minify ? JSON.stringify(value) : stringifyJson(value, options.indent), warnings);
}
