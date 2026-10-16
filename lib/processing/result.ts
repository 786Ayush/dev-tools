/** Every processor returns a Result instead of throwing across the UI boundary. */
export type Result<T> = { ok: true; value: T; warnings: string[] } | { ok: false; error: string };

export function ok<T>(value: T, warnings: string[] = []): Result<T> {
  return { ok: true, value, warnings };
}

export function fail<T = never>(error: string): Result<T> {
  return { ok: false, error };
}

export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

/** Text inputs above this size are rejected to keep the tab responsive. */
export const MAX_TEXT_BYTES = 10 * 1024 * 1024;

export function checkInputSize(input: string, max = MAX_TEXT_BYTES): string | undefined {
  // String length is UTF-16 units; it is a close enough proxy and avoids encoding the whole input.
  if (input.length > max) {
    return `Input is ${(input.length / 1024 / 1024).toFixed(1)} MB. The limit is ${(max / 1024 / 1024).toFixed(0)} MB.`;
  }
  return undefined;
}

/** Converts a 0-based character offset into 1-based line and column numbers. */
export function lineColumnAt(text: string, offset: number): { line: number; column: number } {
  let line = 1;
  let lastBreak = -1;
  const end = Math.min(offset, text.length);
  for (let index = 0; index < end; index += 1) {
    if (text.charCodeAt(index) === 10) {
      line += 1;
      lastBreak = index;
    }
  }
  return { line, column: end - lastBreak };
}
