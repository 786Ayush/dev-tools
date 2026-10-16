import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatJson, parseJson } from "../lib/processing/json";
import { lineColumnAt } from "../lib/processing/result";

describe("JSON processing", () => {
  it("formats with the chosen indent", () => {
    const two = formatJson('{"a":[1,2]}');
    assert.ok(two.ok);
    assert.equal(two.value, '{\n  "a": [\n    1,\n    2\n  ]\n}');

    const tabs = formatJson('{"a":1}', { indent: "tab" });
    assert.ok(tabs.ok);
    assert.equal(tabs.value, '{\n\t"a": 1\n}');
  });

  it("minifies and sorts keys recursively", () => {
    const result = formatJson('{ "b": 1, "a": { "d": 2, "c": 3 } }', { minify: true, sortKeys: true });
    assert.ok(result.ok);
    assert.equal(result.value, '{"a":{"c":3,"d":2},"b":1}');
  });

  it("reports parse errors with a location", () => {
    const result = parseJson('{\n  "a": 1,\n}');
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.match(result.error, /^Invalid JSON:/);
      assert.match(result.error, /line 3/i);
    }
  });

  it("rejects empty input", () => {
    assert.equal(parseJson("   ").ok, false);
  });

  it("warns about integers beyond 2^53 but not about long digit strings", () => {
    const unsafe = formatJson('{"id": 12345678901234567890}');
    assert.ok(unsafe.ok);
    assert.equal(unsafe.warnings.length, 1);

    const quoted = formatJson('{"id": "12345678901234567890"}');
    assert.ok(quoted.ok);
    assert.equal(quoted.warnings.length, 0);
  });

  it("converts offsets to line and column", () => {
    assert.deepEqual(lineColumnAt("ab\ncd", 0), { line: 1, column: 1 });
    assert.deepEqual(lineColumnAt("ab\ncd", 4), { line: 2, column: 2 });
  });
});
