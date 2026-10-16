import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { getToolContent } from "../lib/tool-content";
import { additionalTools } from "../lib/tool-definitions";
import { tools } from "../lib/tool-registry";

const rendererDir = join(__dirname, "../components/tools/renderers");
const rendererSource = readdirSync(rendererDir)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => readFileSync(join(rendererDir, file), "utf8"))
  .join("\n");

describe("tool registry", () => {
  it("uses unique, URL-safe slugs and ids", () => {
    const slugs = tools.map((tool) => tool.slug);
    assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
    const ids = tools.map((tool) => tool.id);
    assert.equal(new Set(ids).size, ids.length, "duplicate id");
    for (const tool of tools) {
      assert.match(tool.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${tool.slug} is not kebab-case`);
    }
  });

  it("only references registered tools as related", () => {
    const slugs = new Set(tools.map((tool) => tool.slug));
    for (const tool of additionalTools) {
      for (const related of tool.related) {
        assert.ok(slugs.has(related), `${tool.slug} references unknown related tool ${related}`);
        assert.notEqual(related, tool.slug);
      }
    }
  });

  it("gives every added tool a renderer and complete content", () => {
    for (const tool of additionalTools) {
      assert.ok(rendererSource.includes(`"${tool.slug}":`), `${tool.slug} has no renderer entry`);
      const content = getToolContent(tool.slug);
      assert.ok(content, `${tool.slug} has no content`);
      assert.ok(content.about.length > 0 && content.howTo.length > 0 && content.commonErrors.length > 0, `${tool.slug} content is incomplete`);
    }
  });

  it("uses unique SEO titles and descriptions of a sensible length", () => {
    const titles = tools.map((tool) => tool.seo.title);
    const descriptions = tools.map((tool) => tool.seo.description);
    assert.equal(new Set(titles).size, titles.length, "duplicate SEO title");
    assert.equal(new Set(descriptions).size, descriptions.length, "duplicate SEO description");
    for (const tool of additionalTools) {
      const length = tool.seo.description.length;
      assert.ok(length >= 70 && length <= 170, `${tool.slug} SEO description is ${length} characters`);
    }
  });

  it("does not feature added tools on the homepage", () => {
    for (const tool of additionalTools) {
      assert.equal(tool.featured, false, `${tool.slug} should not be featured`);
    }
  });
});
