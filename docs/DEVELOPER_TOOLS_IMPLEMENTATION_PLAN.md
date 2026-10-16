# Developer Tools Expansion: Implementation Plan

Status legend: `Not Started` · `In Progress` · `Completed` · `Blocked`

Last updated: 2026-10-11

This plan extends the existing site. It does not replace it. The older `docs/IMPLEMENTATION_PLAN.md` covers the original build and stays as history.

---

## 1. Repository findings

### 1.1 Stack (from `package.json`, configs)

| Item | Value | Notes |
| --- | --- | --- |
| Framework | Next.js 16.4.0, App Router | `cacheComponents: true`, `partialPrefetching: true` in `next.config.ts`. `AGENTS.md` warns APIs differ from older Next; read `node_modules/next/dist/docs/` before using routing, metadata, or caching APIs. |
| React | 19.3.0 | |
| TypeScript | 5.x, `strict: true` | Path alias `@/*` → repo root. |
| Styling | Tailwind CSS v4 via `@tailwindcss/turbopack` | No `tailwind.config`; theme in `app/globals.css`. |
| Icons | `lucide-react` | |
| Existing processing deps | `papaparse`, `sql-formatter`, `cronstrue` | |
| Package manager | npm (`package-lock.json`) | |
| Node (local) | 22.19.0 | |
| Lint | ESLint 9 + `eslint-config-next` | `npm run lint` |
| Tests | `node:test` run through `tsx` | No `test` script yet. Run with `npx tsx --test tests/*.test.ts`. No E2E framework. |

Baseline checks run on 2026-10-11 before any change: `tsc --noEmit` clean, `eslint` clean, unit tests 5/5 pass. Production build not yet run (will run at end of Phase 1 to set a baseline).

### 1.2 Current structure

```text
app/
  layout.tsx            Root layout, Geist fonts, header/footer, metadataBase hard-coded to https://example.com
  page.tsx              Homepage: hero, featured tools (search box is readOnly, non-functional)
  tools/page.tsx        Directory: "use client", search + category <select> (cannot export metadata)
  tools/[slug]/page.tsx Tool page: static map slug → client component, generateStaticParams, generateMetadata
  sitemap.ts, robots.ts Sitemap uses NEXT_PUBLIC_SITE_URL ?? example.com
  about/ privacy/ terms/ not-found.tsx
components/
  layout/site-header.tsx, site-footer.tsx
  theme-toggle.tsx      Class-based dark mode stored in localStorage
  tool-card.tsx         Card with slug → icon map
  tool-page-layout.tsx  Breadcrumb + title wrapper
  tool-components/*.tsx 6 client tools, each with its own copy/error UI
lib/
  tool-registry.ts      Flat ToolDefinition[] with 5 string categories
  tool-utils.ts         Pure processing functions for the 6 tools
tests/tool-utils.test.ts
docs/IMPLEMENTATION_PLAN.md, PROJECT_OVERVIEW.md
```

### 1.3 Existing tools (must keep working)

| Current route | Tool | Known issues found during inspection |
| --- | --- | --- |
| `/tools/json-formatter` | JSON format / minify / validate | None blocking. |
| `/tools/jwt-decoder` | JWT decode | Uses `atob`, so non-ASCII claims decode as mojibake. Only `exp` interpreted; `iat`/`nbf` ignored. No expired/not-yet-valid status. |
| `/tools/cron-generator` | 5-field cron builder + cronstrue | No field validation, no next-run preview, dialect not stated. |
| `/tools/regex-tester` | Regex matching | Runs on the main thread (catastrophic backtracking freezes the tab). Without the `g` flag, `matchAll` throws and the UI wrongly reports "Invalid regular expression". No highlighting. |
| `/tools/csv-to-json` | CSV → JSON via Papa Parse | Trims every value (alters data). Any Papa warning aborts conversion. Duplicate/empty headers not surfaced. |
| `/tools/sql-formatter` | SQL format | Dialect fixed to generic `sql`; no minify. |

### 1.4 Design system

- Dark-first palette: `slate-950/900/800/700` surfaces, `text-white`/`slate-100..500` text, `cyan-300..500` accent, `rounded-xl`/`rounded-2xl`, `border-slate-800` panels.
- Light mode is implemented by **overriding specific Tailwind classes** in `globals.css` (`html:not(.dark) .bg-slate-950 { … }`). New components must use the same class set or light mode breaks. Moving to semantic CSS tokens would be cleaner but is a design-system change; deferred (see Risks R6).
- Copy buttons, error banners, example loaders, and textareas are re-implemented in each tool. These become shared components in Phase 1.

### 1.5 Architectural limitations to address

1. **Flat routing.** All tools live at `/tools/[slug]`. The requested hierarchy needs `/tools/[category]/[tool]`. The six existing URLs must 308-redirect to their new homes so existing links and any indexing are preserved.
2. **Bundle growth.** `tools/[slug]/page.tsx` statically imports every tool component. At ~70 tools this would ship every tool's code to every tool page. Tool components must be loaded per tool (`next/dynamic` or one route-level import per tool; confirm the correct Next 16 pattern in the bundled docs).
3. **Metadata on the directory.** `/tools` is a client component, so it has no route metadata. Split into a server page plus a client search island.
4. **Site URL is inconsistent** (`layout.tsx` hard-codes example.com, sitemap reads an env var). Centralize in `lib/site.ts`.
5. **Registry categories are untyped strings** with no category pages, no content, and no icon typing.

---

## 2. Product inventory and consolidation

The requested inventory has ~150 items. Many are modes of one tool. Rule applied: **one page per distinct search intent with a distinct output; trivial variations become modes.** Where two directions are both high-intent (CSV→JSON and JSON→CSV), each gets its own route, both rendering one shared workspace with a swap control that navigates to the inverse route.

Result: **11 categories, 71 routes** in the full inventory, built in priority tiers.

Priority: **P0** = core, required for acceptance. **P1** = Phase 6 high-value additions. **P2** = backlog, built only after P0/P1 pass QA.

### 2.1 Encoders & Decoders: `/tools/encoders-decoders`

| Route slug | Covers | Shared component | Priority |
| --- | --- | --- | --- |
| `jwt-decoder` | JWT Decoder | `JwtWorkspace` (Decode tab) | P0 |
| `jwt-encoder` | JWT Encoder | `JwtWorkspace` (Encode tab) | P0 |
| `base64-encoder-decoder` | Base64 Encoder, Base64 Decoder (text, URL-safe, file) | `EncodeDecodeWorkspace` | P1 |
| `url-encoder-decoder` | URL Encoder, URL Decoder (component vs full URI) | `EncodeDecodeWorkspace` | P1 |
| `html-entity-encoder-decoder` | HTML Encoder/Decoder, HTML Entity Encoder/Decoder (same operation; merged) | `EncodeDecodeWorkspace` | P1 |
| `json-string-escape` | JSON String Escape, Unescape | `EncodeDecodeWorkspace` | P1 |
| `unicode-encoder-decoder` | Unicode Encoder/Decoder (`\uXXXX`, code points, UTF-8 bytes) | `EncodeDecodeWorkspace` | P1 |

### 2.2 Data Converters: `/tools/data-converters`

Landing page grouped into: JSON converters, CSV & TSV converters, XML converters, YAML & TOML converters, Spreadsheet converters, Code generators.

| Route slug | Group | Priority |
| --- | --- | --- |
| `csv-to-json`, `json-to-csv` | CSV & TSV | P0 |
| `json-to-yaml`, `yaml-to-json` | YAML & TOML | P0 |
| `json-to-xml`, `xml-to-json` | XML | P0 |
| `json-to-tsv`, `tsv-to-json` | CSV & TSV | P0 |
| `json-to-typescript` | Code generators. Covers TS Interfaces **and** TS Types via an `interface`/`type` toggle | P0 |
| `json-to-json-schema` | Code generators | P0 |
| `csv-to-xml`, `xml-to-csv` | XML | P0 |
| `json-to-toml`, `toml-to-json` | YAML & TOML | P0 |
| `json-to-excel`, `excel-to-json` | Spreadsheet | P0 |
| `yaml-to-xml`, `xml-to-yaml` | XML | P2 |
| `json-to-go`, `json-to-python`, `json-to-java`, `json-to-csharp`, `json-to-kotlin`, `json-to-swift`, `json-to-dart` | Code generators (one shared type-inference core, one emitter per language) | P2 |

All text converters share `ConverterWorkspace` and a typed adapter: `parse(source) → intermediate JSON value → serialize(target)`. Pairs like XML→CSV pivot through JSON and warn about flattening.

### 2.3 Formatters & Validators: `/tools/formatters-validators`

| Route slug | Covers | Priority |
| --- | --- | --- |
| `json-formatter` (existing, moved) | JSON Formatter, Validator, Minifier (modes) | P0 (move + polish) |
| `xml-formatter` | XML Formatter, XML Validator (well-formedness only) | P1 |
| `yaml-formatter` | YAML Formatter, YAML Validator | P1 |
| `html-formatter`, `css-formatter`, `javascript-formatter`, `typescript-formatter` | Prettier standalone, one shared `CodeFormatterWorkspace` | P2 |
| `markdown-preview` | Markdown Preview + Markdown Formatter (format action) | P2 |

SQL Formatter and SQL Minifier appear in this category as **cross-links** to the canonical page in SQL & Database. No duplicate page.

### 2.4 Text Utilities: `/tools/text-utilities`

| Route slug | Covers | Priority |
| --- | --- | --- |
| `text-case-converter` | Text Case, Uppercase, Lowercase, Title, Sentence, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE (11 items → 1 page) | P1 |
| `line-tools` | Sort Lines, Remove Duplicate Lines, Reverse Text, Remove Extra Spaces | P1 |
| `text-diff` | Text Diff Checker | P1 |
| `word-counter` | Word, Character, Line Counter + reading time | P1 |
| `find-and-replace` | Find and Replace (plain and regex mode; regex runs in worker) | P2 |
| `lorem-ipsum-generator` | Lorem Ipsum | P2 |

### 2.5 Date & Time: `/tools/date-time`

| Route slug | Covers | Priority |
| --- | --- | --- |
| `unix-timestamp-converter` | Unix → Date, Date → Unix, ISO 8601 converter (s / ms / µs auto-detect) | P1 |
| `timezone-converter` | Timezone Converter, UTC to Local | P1 |
| `date-difference-calculator` | Date Difference | P1 |
| `date-format-converter` | Date Format Converter | P2 |

### 2.6 Number & Color: `/tools/number-color`

| Route slug | Covers | Priority |
| --- | --- | --- |
| `number-base-converter` | All 6 decimal/binary/hex/octal directions; BigInt for arbitrary size | P1 |
| `color-converter` | RGB↔HEX, RGB↔HSL, HEX→HSL, CSS Color Converter (named colors, alpha) | P1 |

### 2.7 Web & URL: `/tools/web-url`

| Route slug | Covers | Priority |
| --- | --- | --- |
| `url-parser` | URL Parser, Query Parameter Parser, Query String Builder (editable param table rebuilds the URL) | P1 |
| `slug-generator` | URL Slug Generator | P2 |
| `html-to-text` | HTML to Plain Text (DOMParser, no script execution) | P2 |
| `html-preview` | HTML Preview in `<iframe sandbox>` with scripts disabled | P2 |
| `css-gradient-generator` | CSS Gradient Generator | P2 |
| `meta-tag-generator` | Meta Tag / Open Graph Generator | P2 |

### 2.8 Regular Expressions: `/tools/regex`

| Route slug | Covers | Priority |
| --- | --- | --- |
| `regex-tester` (existing, moved) | Tester: highlighting, groups, flags | P0 |
| `regex-replace` | Replace Tester | P0 |
| `regex-extractor` | Match Extractor (list / JSON / CSV output) | P0 |
| `regex-patterns` | Common Patterns library; each pattern opens in the tester via URL state | P0 |
| `regex-explainer` | Regex Explanation (needs a regex AST parser) | P2 |

All four P0 routes share `RegexWorkspace`. Matching always runs in a Web Worker with a timeout.

### 2.9 Cron & Scheduling: `/tools/cron`

| Route slug | Covers | Priority |
| --- | --- | --- |
| `cron-generator` (existing, moved) | Generator with form + presets | P0 |
| `cron-parser` | Parser + Explainer (merged): description, field breakdown, next N runs | P0 |
| `cron-examples` | Schedule Examples (server-rendered reference page) | P0 |

Dialect: **standard 5-field Unix/Vixie cron only.** The UI and docs state that Quartz (6–7 fields, `?`), AWS EventBridge, and Kubernetes `@every` syntax are not supported.

### 2.10 SQL & Database: `/tools/sql`

| Route slug | Covers | Priority |
| --- | --- | --- |
| `sql-formatter` (existing, moved) | SQL Formatter + SQL Minifier (mode), dialect selector | P0 (Phase 7) |
| `json-to-sql-insert` | JSON → INSERT statements | P1 |
| `sql-to-typescript` | SQL to TS Types + SQL Schema to TS (merged; input is `CREATE TABLE`) | P1 |
| `sql-to-json-schema` | SQL Schema → JSON Schema | P1 |
| `sql-validator` | Syntax parse only, labelled "not validated against a database" | P2 |
| `sql-to-json` | `INSERT … VALUES` → JSON rows | P2 |

### 2.11 File & Data Utilities: `/tools/file-data`

| Route slug | Covers | Priority |
| --- | --- | --- |
| `csv-viewer` | CSV Viewer + CSV Validator (table, row/column counts, ragged-row warnings) | P1 |
| `csv-delimiter-converter` | Delimiter converter | P1 |
| `file-size-converter` | B/KB/MB/GB, SI vs IEC | P1 |
| `mime-type-lookup` | MIME Type Lookup + File Extension Lookup (bidirectional, curated static table) | P1 |
| `json-viewer` | JSON File Viewer (collapsible tree) | P2 |
| `yaml-viewer`, `xml-viewer` | Reuse tree viewer | P2 |

### 2.12 Totals

| Tier | Routes |
| --- | --- |
| P0 | 30 (6 existing moved + 24 new) |
| P1 | 23 |
| P2 | 26 (incl. 7 language code generators) |
| Category landing pages | 11 |

---

## 3. Routing

```text
/tools                                 Directory: server page + client search/filter island
/tools/[category]                      Category landing (generateStaticParams from registry)
/tools/[category]/[tool]               Tool page (generateStaticParams from registry)
```

- All pages are statically generated at build time. No runtime server work.
- `next.config.ts` `redirects()` sends `/tools/<old-slug>` → `/tools/<category>/<slug>` with `permanent: true` (308) for the six existing tools. Redirects run before the filesystem router, so they do not clash with `[category]`.
- Unknown category or tool → `notFound()`. Tool registered under a different category → `notFound()` (no duplicate URLs).
- Tool slugs are globally unique, so search and related-tool links resolve by slug alone.
- No query-parameter variants are indexed. Tool state in the URL (regex patterns, cron expressions) goes in the hash or uses `canonical` to the clean route.

---

## 4. Code architecture

### 4.1 Folders

```text
lib/
  site.ts                         siteUrl, siteName (single source)
  tools/
    types.ts                      ToolCategory, ToolDefinition, ToolContent types
    categories.ts                 11 category definitions
    registry.ts                   All ToolDefinitions + lookup helpers (byId, bySlug, byCategory, related, search)
    content/<category>.ts         Per-tool educational content (how-to, examples, errors, FAQ)
  processing/                     Pure, framework-free functions. Unit-tested. No React imports.
    jwt.ts  cron.ts  regex.ts  csv.ts  converters/*.ts  sql.ts  text.ts  color.ts  number.ts  date.ts ...
  workers/regex.worker.ts         Regex execution off the main thread
  seo.ts                          buildToolMetadata, buildCategoryMetadata, JSON-LD builders
components/
  tools/shared/                   ToolPanel, CodeTextarea, OutputPanel, ActionBar (copy/download/clear/reset/example),
                                  StatusBanner (error/warning/success/info), FileDropzone, ModeTabs, SegmentedControl
  tools/workspaces/               JwtWorkspace, ConverterWorkspace, RegexWorkspace, CronWorkspace, EncodeDecodeWorkspace ...
  tools/tool-renderer.tsx         Maps tool id → lazily loaded workspace
  tools/tool-content.tsx          Server component rendering educational content
  tools/breadcrumbs.tsx, related-tools.tsx, category-card.tsx, tool-search.tsx
```

Existing `components/tool-components/*` are migrated into the new structure. Existing `lib/tool-utils.ts` functions move into `lib/processing/*`; `tool-utils.ts` keeps re-exports until tests are migrated, then is removed.

### 4.2 Types

```ts
import type { LucideIcon } from "lucide-react";

export type CategoryId =
  | "encoders-decoders" | "data-converters" | "formatters-validators" | "text-utilities"
  | "date-time" | "number-color" | "web-url" | "regex" | "cron" | "sql" | "file-data";

export type ToolCategory = {
  id: CategoryId;               // also the URL segment
  title: string;
  shortTitle: string;
  description: string;          // landing intro
  icon: LucideIcon;
  groups?: { id: string; title: string; description: string }[]; // e.g. data-converter families
  seo: { title: string; description: string };
};

export type ToolStatus = "live" | "planned";

export type ToolDefinition = {
  id: string;                   // globally unique, also the URL segment
  title: string;
  description: string;
  categoryId: CategoryId;
  groupId?: string;
  crossListedIn?: CategoryId[]; // shown as a link card in other categories, no extra route
  keywords: string[];
  icon: LucideIcon;
  featured?: boolean;
  relatedToolIds: string[];     // validated by a unit test: every id must exist
  status: ToolStatus;           // only "live" tools get routes, sitemap entries, and search results
  seo: { title: string; description: string };
};

export type ToolContent = {
  howTo: string[];
  examples: { title: string; input: string; output?: string }[];
  commonErrors: { error: string; fix: string }[];
  faq?: { question: string; answer: string }[];
  limitations?: string[];
};

export type Result<T> = { ok: true; value: T; warnings: string[] } | { ok: false; error: string };
```

`href` is derived (`/tools/${categoryId}/${id}`), never stored. `relatedToolIds` and `categoryId` integrity is enforced by tests, not by hand.

### 4.3 Processing contract

- Every processor returns `Result<T>`. No throws across the UI boundary.
- Converters return warnings for lossy steps (dropped `null` in TOML, flattened nested objects in CSV, XML attribute naming) instead of silently discarding.
- Input size guard: soft warning at 1 MB, hard stop at 10 MB of text (files up to 10 MB). Documented per tool.

---

## 5. Dependencies

Install only when the phase that needs it starts. Heavy libraries are dynamically imported inside the tool that uses them.

| Package | Purpose | Phase | Approx. size (min+gz, unverified) | Why this one |
| --- | --- | --- | --- | --- |
| `jose` | JWT sign (HS256/384/512, RS256, ES256) and verify via WebCrypto | 2 | ~15 KB tree-shaken | Maintained, zero deps, browser-native crypto. No hand-rolled crypto. |
| `cron-parser` | Validate cron and compute next runs | 3 | ~20 KB + luxon | Mature. `cronstrue` stays for descriptions. |
| `yaml` | YAML parse/stringify with error positions | 5 | ~35 KB | Spec-compliant, good errors, TS types. |
| `fast-xml-parser` | XML parse/build/validate | 5 | ~30 KB | No native deps, has validator, attribute control. |
| `smol-toml` | TOML 1.0 parse/stringify | 5 | ~8 KB | Small, spec-compliant, maintained. |
| SheetJS CE `xlsx` 0.20.x from `cdn.sheetjs.com` tarball | XLSX read/write | 5 | ~300 KB, lazy | The npm registry copy (0.18.5) has known CVEs and is unmaintained there. Install from the official tarball URL, pinned. See R3. |
| `diff` | Text diff | 6 | ~15 KB | Standard jsdiff. |
| `node-sql-parser` | `CREATE TABLE` / `INSERT` parsing for SQL→TS/JSON Schema/JSON | 6 | large, lazy, per-dialect build | Only maintained multi-dialect JS SQL parser. |
| `@playwright/test` (dev) | E2E | 9 | dev only, Chromium download ~150 MB | Standard for Next E2E. |
| P2 only: `prettier` (standalone + plugins), `marked` + `dompurify`, `regexp-tree` | Code formatters, Markdown preview, regex explainer | P2 | lazy | Decide when P2 starts. |

Existing deps reused: `papaparse` (CSV/TSV), `sql-formatter` (all SQL formatting, supports dialects), `cronstrue`.

Not adding: date libraries (native `Intl` covers timezone conversion), color libraries (HEX/RGB/HSL math is small and testable), quicktype (multi-MB; own inference is enough for TS/JSON Schema).

---

## 6. UX requirements

- Reuse the existing palette and class set (see 1.4) so light mode keeps working.
- Shared workspace layout: input panel left, output right on `lg`, stacked on mobile. Action bar: Example, Clear, Convert/Run, Swap (where an inverse route exists), Copy, Download.
- Related modes switch via `ModeTabs` (roving tabindex, arrow keys, `aria-selected`). Tabs that map to separate routes are links, not client state.
- Every interactive control has a visible focus ring (`focus-visible:ring-2 ring-cyan-400`), an accessible name, and works by keyboard.
- Errors render in `StatusBanner` with `role="alert"`; success and copy confirmations use `aria-live="polite"`.
- Empty state on every output panel explains what to do.
- No animations beyond existing hover transitions. Respect `prefers-reduced-motion` (already global).
- No ads or upsells inside workspaces.
- Header gains a "Categories" menu (11 entries, keyboard accessible); mobile gets a disclosure menu (the header currently hides nav below `md`).
- Category landing: intro, grouped cards (Data Converters uses its 6 groups), cross-listed tools, short educational section.
- Homepage search becomes functional (links into `/tools?q=`).

---

## 7. SEO requirements

- `lib/seo.ts` builds metadata from the registry: unique `title`, `description`, `alternates.canonical`, Open Graph, Twitter card.
- Tool pages render server-side: H1, intro, workspace, then content sections (How to use, Examples, Common errors, Limitations, FAQ, Related tools).
- JSON-LD: `BreadcrumbList` on category and tool pages; `WebApplication` on tool pages. FAQ markup is valid but Google limits FAQ rich results to government and health sites, so do not count on it.
- Sitemap: home, `/tools`, 11 category pages, every `status: "live"` tool. Static pages unchanged. No parameter variants.
- `metadataBase` and sitemap both read `lib/site.ts` (`NEXT_PUBLIC_SITE_URL`, fallback documented).
- Avoid thin pages: a tool does not ship without its `ToolContent` entry (enforced by test).

---

## 8. Privacy and security

- All processing runs in the browser. No API routes are added. No tool input is sent to any server.
- JWT secrets and private keys: kept in React state only. Never written to `localStorage`, `sessionStorage`, URL, or logs. Inputs use `autoComplete="off"` and `spellCheck={false}`. Cleared on unmount.
- JWT decoder states on every result: "Decoded, not verified." Verification is a separate, explicit action requiring the user's key, and reports "Signature valid for the key you provided" only.
- JWT encoder: `alg: none` produces a token labelled **Unsigned**, never "signed". Example secret is visibly a placeholder.
- Regex: user patterns run in a dedicated Worker, terminated after 1.5 s; input capped at 1 MB; match list capped at 10,000.
- HTML preview (P2): `<iframe sandbox="">` with `srcdoc`, no `allow-scripts`. Markdown output sanitized with DOMPurify.
- File uploads: read with `File.text()`/`arrayBuffer()` locally, 10 MB cap, type checked by extension and content.
- No new analytics. If analytics is added later, tool inputs must never be included.

---

## 9. Testing strategy

| Layer | Tool | Scope |
| --- | --- | --- |
| Unit | `node:test` + `tsx` (existing) | Every `lib/processing/*` module; registry integrity (unique ids, valid related ids, every live tool has content, every live tool has a renderer). |
| Component smoke | Covered by E2E (no jsdom setup, to avoid a second test stack) | |
| E2E | Playwright, Chromium only | Directory search + filter, category navigation, one workflow per P0 workspace, copy (clipboard permission granted), download (download event), mobile viewport nav, keyboard tab navigation, theme toggle, 308 redirects for old URLs, metadata/canonical present. |
| Static | `tsc --noEmit`, `eslint` | |
| Build | `next build` | Must list all expected static routes. |

Scripts to add: `test`, `test:e2e`, `typecheck`.

Required unit cases (from the brief): valid/invalid JWTs, `exp`/`iat`/`nbf` handling, signing failure (bad secret length, bad key, non-object payload), valid/invalid cron, regex syntax error, regex timeout, CSV quoted fields, escaped quotes, empty and duplicate headers, nested JSON → CSV/XML/YAML/TOML, YAML/XML/TOML parse errors, SQL formatting per dialect, minify preserves string literals and comments.

---

## 10. Vercel constraints

- Every route is static (SSG). No functions are required at runtime, so plan limits on function duration and invocations do not apply to tools.
- No database, KV, Redis, auth, or background workers.
- Redirects in `next.config.ts` are served by the platform.
- Build time grows with ~80 prerendered pages; expected to stay well under limits (to be measured in Phase 10).
- Large libraries are lazy so first-load JS on light tools stays near current levels (measured from `next build` output in Phase 10).

---

## 11. Phases

Each phase ends with `tsc`, `eslint`, unit tests green, and a plan update. Phases 2–5 depend on Phase 1. Phase 7 depends on Phase 1. Phase 6 depends on Phases 1 and 5 (shared converter and encode/decode workspaces). Phase 8 runs alongside each phase (content per tool) and finishes after 6. Phase 9 runs alongside each phase and finishes last. Phase 10 is last.

### Phase 0: Inspection and plan

| Task | Status |
| --- | --- |
| Inspect repo, configs, routes, components, tests | Completed |
| Run baseline `tsc`, `eslint`, unit tests | Completed |
| Write this plan | Completed |

Acceptance: plan exists before any application code change. ✔

### Phase 1: Shared architecture

| Task | Status |
| --- | --- |
| Read Next 16 docs for dynamic routes, `generateStaticParams` with `cacheComponents`, metadata, redirects, lazy client components | Not Started |
| Run baseline `next build`, record route list and first-load JS | Not Started |
| `lib/site.ts`; wire `metadataBase` and sitemap to it | Not Started |
| `lib/tools/types.ts`, `categories.ts`, `registry.ts` (migrate 6 tools) | Not Started |
| `lib/seo.ts` metadata and JSON-LD helpers | Not Started |
| Routes `/tools/[category]` and `/tools/[category]/[tool]`; remove `/tools/[slug]` | Not Started |
| 308 redirects for the six old URLs | Not Started |
| `/tools` as server page + client search/filter island (category chips, query, `?q=` support) | Not Started |
| Shared components: ToolPanel, CodeTextarea, OutputPanel, ActionBar, StatusBanner, FileDropzone, ModeTabs | Not Started |
| `useCopy`, `downloadText`/`downloadBlob` helpers | Not Started |
| Breadcrumbs, RelatedTools, CategoryCard, ToolContent renderer | Not Started |
| Tool renderer with per-tool lazy loading | Not Started |
| `error.tsx` boundary for tool routes | Not Started |
| Header categories menu + mobile menu; functional homepage search | Not Started |
| Migrate 6 existing tools to shared components (no behaviour loss) | Not Started |
| Registry integrity unit tests; add `test`/`typecheck` scripts | Not Started |

Acceptance: old URLs 308 to new ones; all 6 tools work at new URLs; 11 category pages render (categories with no live tools show "coming soon" and are excluded from sitemap); directory search and filter work; `next build` passes; no tool page loads another tool's code.

### Phase 2: JWT decoder and encoder

| Task | Status |
| --- | --- |
| `lib/processing/jwt.ts`: UTF-8-safe Base64URL decode, header/payload parse, claim table, `exp`/`iat`/`nbf` status with clock-skew note | Not Started |
| Decoder UI: example tokens (valid, expired, not-yet-valid), copy header/payload, "not verified" banner | Not Started |
| Optional verify action with user-supplied secret/public key via `jose` | Not Started |
| Encoder UI: header/payload JSON editors, object validation, claim helpers (`iat` now, `exp` +N, `nbf`), algorithm select | Not Started |
| Signing: HS256/384/512 (secret, minimum length warning), RS256/ES256 with pasted PEM via `jose`; `none` labelled Unsigned | Not Started |
| Explainer: unsigned vs signed vs verified; HS256 shared-secret caveat | Not Started |
| Unit tests incl. failure cases | Not Started |

Acceptance: decodes non-ASCII claims correctly; reports expired / not yet valid / valid-by-time; never labels a token authentic from decoding; signed tokens produced here verify with `jose` in tests; secrets never touch storage.

### Phase 3: Cron

| Task | Status |
| --- | --- |
| `lib/processing/cron.ts`: validate 5-field expression with per-field errors, describe, next N runs (local and UTC) | Not Started |
| Generator: per-field controls (every / specific / range / step), presets, manual input, two-way sync | Not Started |
| Parser/Explainer page: description, field table, next runs | Not Started |
| Examples page (server-rendered, each example links to parser) | Not Started |
| Dialect notice (Unix only; Quartz/EventBridge differences) | Not Started |
| Unit tests | Not Started |

Acceptance: invalid fields produce specific errors; next runs match `cron-parser`; dialect documented on page.

### Phase 4: Regex

| Task | Status |
| --- | --- |
| `regex.worker.ts` + client wrapper with 1.5 s timeout, terminate and respawn | Not Started |
| Correct handling without `g` flag; zero-length match safety; named groups | Not Started |
| Tester: highlighted matches, count, groups table | Not Started |
| Replace: `$1`, `$<name>`, `$&` preview | Not Started |
| Extractor: list / JSON / CSV output, unique toggle | Not Started |
| Patterns library with explanations and caveats; open-in-tester | Not Started |
| JS regex compatibility notes (no lookbehind issues in modern browsers, no PCRE-only syntax, `v` flag support varies) | Not Started |
| Unit tests (pure matcher) + E2E timeout test | Not Started |

Acceptance: `(a+)+$` against a long `aaaa…!` string reports a timeout without freezing the page; syntax errors show the engine message.

### Phase 5: Core data converters

| Task | Status |
| --- | --- |
| `ConverterWorkspace` (input, file upload, output, swap, stats, warnings) | Not Started |
| CSV/TSV adapter: no value trimming by default (option), quoted fields, escaped quotes, empty headers → `column_N`, duplicate headers → `name_2`, ragged rows warned | Not Started |
| JSON→CSV/TSV: flatten nested objects with dot paths, arrays as JSON strings, header union across rows, warnings | Not Started |
| YAML adapter (`yaml`) | Not Started |
| XML adapter (`fast-xml-parser`): attribute prefix, text node key, root element option, validation | Not Started |
| TOML adapter (`smol-toml`): root must be table, `null` unsupported → warning | Not Started |
| XML↔CSV via JSON pivot | Not Started |
| JSON→TypeScript (interface/type toggle, optional fields from sampling, union types, root name) | Not Started |
| JSON→JSON Schema (draft 2020-12, required inference) | Not Started |
| XLSX: decide package per R3, read first/selected sheet, write one sheet per top-level array | Not Started |
| Data Converters landing page with 6 groups | Not Started |
| Move existing `csv-to-json` to the workspace | Not Started |
| Unit tests per adapter incl. round-trips and failures | Not Started |

Acceptance: 17 P0 converter routes live; round-trip tests pass where lossless; every lossy step produces a visible warning.

### Phase 6: Additional converters (P1)

| Task | Status |
| --- | --- |
| A. `EncodeDecodeWorkspace`; Base64 (UTF-8, URL-safe, file), URL, HTML entities, JSON string, Unicode; URL parser + query builder | Not Started |
| B. Text case converter, line tools, word counter, text diff | Not Started |
| C. Number base converter (BigInt), color converter | Not Started |
| D. Unix timestamp, timezone converter, date difference | Not Started |
| E. JSON→SQL INSERT, SQL→TypeScript, SQL→JSON Schema (`node-sql-parser`, lazy) | Not Started |
| File & data: CSV viewer/validator, delimiter converter, file size, MIME lookup | Not Started |
| Unit tests for each processor | Not Started |

Acceptance: 23 P1 routes live with tests and content.

### Phase 7: SQL formatter upgrade

| Task | Status |
| --- | --- |
| Dialect selector (sql-formatter supported list) | Not Started |
| Options: keyword case, indent width | Not Started |
| Minify mode preserving string literals and comments (tokenizer-based, tested) | Not Started |
| Examples, copy, download, error messages naming unsupported syntax | Not Started |
| Notice: formats only, never executes or connects | Not Started |
| Unit tests per dialect and minify edge cases | Not Started |

Acceptance: formats PostgreSQL/MySQL/T-SQL/BigQuery samples; minify output re-formats to equivalent SQL; strings like `'--not a comment'` survive.

### Phase 8: SEO and content

| Task | Status |
| --- | --- |
| `ToolContent` for every live tool | Not Started |
| Category intro content | Not Started |
| JSON-LD on category and tool pages | Not Started |
| Sitemap from registry; robots unchanged | Not Started |
| Test: unique titles/descriptions across registry | Not Started |

Acceptance: every live page has unique metadata, canonical, breadcrumbs, related tools, and content sections.

### Phase 9: Testing and QA

| Task | Status |
| --- | --- |
| Install Playwright (Chromium), config with `next build && next start` web server | Not Started |
| E2E specs listed in section 9 | Not Started |
| Manual keyboard and light/dark pass on each workspace | Not Started |
| All checks green | Not Started |

### Phase 10: Deployment and docs

| Task | Status |
| --- | --- |
| `next build` route list and first-load JS comparison against Phase 1 baseline | Not Started |
| Verify no API routes / functions added | Not Started |
| `docs/ARCHITECTURE.md`, `docs/SEO_GUIDE.md`, `docs/TESTING.md`, `README.md` | Not Started |
| Final status update of this plan | Not Started |

### P2 backlog (after P0/P1 QA)

YAML↔XML, 7 language code generators, XML/YAML formatters' Prettier siblings (HTML/CSS/JS/TS), Markdown preview, find and replace, lorem ipsum, date format converter, slug generator, HTML to text, HTML preview, gradient generator, meta tag generator, regex explainer, SQL validator, SQL to JSON, JSON/YAML/XML tree viewers. All `Not Started`.

---

## 12. Risks, limitations, open questions

| # | Item | Impact | Mitigation / decision |
| --- | --- | --- | --- |
| R1 | Next 16.4 APIs differ from older docs (`AGENTS.md`) | Wrong routing/metadata code | Read bundled docs before Phase 1 routing work. |
| R2 | `cacheComponents: true` may require Suspense or static params for `params` access | Build errors on dynamic routes | Full `generateStaticParams` coverage; verify in baseline build. |
| R3 | XLSX library: npm `xlsx@0.18.5` has CVEs (prototype pollution, ReDoS) | Security | Use SheetJS 0.20.x from official CDN tarball, pinned, lazy-loaded. Fallback: `exceljs` (larger). Open question for the owner if a non-registry dependency is unacceptable. |
| R4 | Data model mismatches (XML attributes, TOML no null, CSV flat) | Users lose data unknowingly | Warnings in `Result.warnings`, limitations in content. |
| R5 | Bundle size from ~70 tools | Slow pages | Per-tool lazy loading; measure in Phase 10. |
| R6 | Light theme depends on class overrides | New classes break light mode | Stick to the existing class set; record tokenization as tech debt. |
| R7 | Moving URLs | Temporary ranking fluctuation | 308 redirects, canonical on new URLs, sitemap updated in the same release. |
| R8 | ThemeToggle reads `localStorage` in `useState` initializer | Hydration warning, theme flash | Out of scope unless it blocks E2E; note in ARCHITECTURE.md. |
| R9 | `node-sql-parser` dialect coverage | Some `CREATE TABLE` syntax fails | Show parser error and supported dialects; limitation documented. |
| R10 | Regex worker cannot interrupt a single `RegExp` call mid-flight except by `terminate()` | Must respawn worker | Wrapper terminates and recreates on timeout (tested). |
| Q1 | Production domain for `NEXT_PUBLIC_SITE_URL` | Canonicals point at example.com | Needs owner input; build works without it. |
| Q2 | Accept the XLSX dependency choice in R3? | | Default: SheetJS tarball. |
