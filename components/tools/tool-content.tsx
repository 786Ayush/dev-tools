import type { ToolContent } from "@/lib/tool-content/types";

const preClass = "overflow-auto whitespace-pre-wrap break-words rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100";

/** Server-rendered educational content below a tool workspace. */
export default function ToolContentSections({ toolName, content }: { toolName: string; content: ToolContent }) {
  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-10">
        <section aria-labelledby="about-heading">
          <h2 id="about-heading" className="text-2xl font-semibold text-white">
            About the {toolName}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-300">
            {content.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="howto-heading">
          <h2 id="howto-heading" className="text-2xl font-semibold text-white">
            How to use it
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-300">
            {content.howTo.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        {content.examples.length > 0 ? (
          <section aria-labelledby="examples-heading">
            <h2 id="examples-heading" className="text-2xl font-semibold text-white">
              Examples
            </h2>
            <div className="mt-3 space-y-4">
              {content.examples.map((example) => (
                <div key={example.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <h3 className="text-base font-medium text-white">{example.title}</h3>
                  {example.note ? <p className="mt-1 text-sm text-slate-400">{example.note}</p> : null}
                  <div className={`mt-3 grid gap-3 ${example.output ? "md:grid-cols-2" : ""}`}>
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-[0.12em] text-slate-400">Input</p>
                      <pre className={preClass}>{example.input}</pre>
                    </div>
                    {example.output ? (
                      <div>
                        <p className="mb-1 text-xs uppercase tracking-[0.12em] text-slate-400">Output</p>
                        <pre className={preClass}>{example.output}</pre>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {content.faq?.length ? (
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-semibold text-white">
              Frequently asked questions
            </h2>
            <dl className="mt-3 space-y-4">
              {content.faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-medium text-white">{item.question}</dt>
                  <dd className="mt-1 text-sm leading-7 text-slate-300">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </div>

      <aside className="space-y-8">
        <section aria-labelledby="errors-heading" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 id="errors-heading" className="text-lg font-semibold text-white">
            Common errors
          </h2>
          <dl className="mt-3 space-y-4">
            {content.commonErrors.map((item) => (
              <div key={item.error}>
                <dt className="font-mono text-xs text-amber-300 [html:not(.dark)_&]:text-amber-700">{item.error}</dt>
                <dd className="mt-1 text-sm leading-6 text-slate-300">{item.fix}</dd>
              </div>
            ))}
          </dl>
        </section>

        {content.limitations?.length ? (
          <section aria-labelledby="limits-heading" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 id="limits-heading" className="text-lg font-semibold text-white">
              Limitations
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              {content.limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </aside>
    </div>
  );
}
