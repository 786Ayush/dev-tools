import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  convertCsvToJson,
  decodeJwt,
  formatJsonValue,
  formatSqlString,
  runRegexTest,
} from "../lib/tool-utils";

function createSampleJwt(payload: Record<string, unknown>) {
  const base64Url = (value: string) =>
    Buffer.from(value).toString("base64url");

  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64Url(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

describe("tool utilities", () => {
  it("formats valid JSON and preserves invalid JSON errors", () => {
    const valid = formatJsonValue('{"hello":"world"}');
    assert.equal(valid.ok, true);
    assert.ok(valid.value?.includes("\n  \"hello\": \"world\""));

    const invalid = formatJsonValue('{"broken": }');
    assert.equal(invalid.ok, false);
    assert.match(invalid.error ?? "", /Invalid JSON/i);
  });

  it("decodes a JWT payload without requiring a signature check", () => {
    const sample = createSampleJwt({ sub: "abc123", exp: 1_700_000_000, role: "admin" });
    const decoded = decodeJwt(sample);

    assert.equal(decoded.ok, true);
    assert.equal(decoded.payload?.sub, "abc123");
    assert.equal(decoded.payload?.role, "admin");
    assert.ok(decoded.expiresAt);
  });

  it("detects regex matches and capture groups", () => {
    const result = runRegexTest("user_(\\d+)", "g", "user_42 and user_99");

    assert.equal(result.ok, true);
    assert.equal(result.matchCount, 2);
    assert.equal(result.matches?.[0], "user_42");
    assert.deepEqual(result.groups?.[0], ["42"]);
  });

  it("converts CSV with headers into JSON", () => {
    const csv = "name,email\nAva,ava@example.com\nNoah,noah@example.com";
    const result = convertCsvToJson(csv, ",", true);

    assert.equal(result.ok, true);
    assert.ok(result.value?.includes('"name": "Ava"'));
    assert.ok(result.value?.includes('"email": "ava@example.com"'));
  });

  it("formats SQL input for readability", () => {
    const sql = "select * from users where active = true order by created_at desc";
    const result = formatSqlString(sql);

    assert.equal(result.ok, true);
    assert.ok(result.value?.includes("SELECT"));
    assert.ok(result.value?.includes("FROM"));
    assert.ok(result.value?.includes("users"));
  });
});
