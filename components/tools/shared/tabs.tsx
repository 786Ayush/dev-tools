"use client";

import Link from "next/link";
import { useId, useRef, type KeyboardEvent } from "react";
import { focusRing } from "./styles";

export type TabOption<T extends string> = { value: T; label: string };

const tabBase = `rounded-lg px-3 py-1.5 text-sm transition ${focusRing}`;
const tabActive = "bg-cyan-500 font-medium text-slate-950";
const tabIdle = "text-slate-300 hover:bg-slate-800 hover:text-white";

/**
 * Segmented control for switching modes in place. Implements the WAI-ARIA tabs pattern
 * with roving tabindex: Tab enters the group, arrow keys and Home/End move between options.
 */
export function ModeTabs<T extends string>({
  label,
  options,
  value,
  onChange,
  idPrefix,
}: {
  label: string;
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Set when panels use aria-controls; tab ids become `${idPrefix}-tab-${value}`. */
  idPrefix?: string;
}) {
  const generated = useId();
  const prefix = idPrefix ?? generated;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % options.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + options.length) % options.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = options.length - 1;
    else return;
    event.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-700 bg-slate-950 p-1">
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(element) => {
              refs.current[index] = element;
            }}
            id={`${prefix}-tab-${option.value}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={idPrefix ? `${prefix}-panel-${option.value}` : undefined}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`${tabBase} ${selected ? tabActive : tabIdle}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Navigation between sibling routes that share one workspace (e.g. JWT decode/encode). */
export function RouteTabs({ label, items, current }: { label: string; items: { href: string; label: string; id: string }[]; current: string }) {
  return (
    <nav aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-700 bg-slate-950 p-1">
      {items.map((item) => {
        const active = item.id === current;
        return (
          <Link key={item.id} href={item.href} aria-current={active ? "page" : undefined} className={`${tabBase} ${active ? tabActive : tabIdle}`}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
