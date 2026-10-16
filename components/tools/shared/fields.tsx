"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { inputClass, labelClass } from "./styles";

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
  ...props
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> & {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  hint?: ReactNode;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          const match = options.find((option) => option.value === event.target.value);
          if (match) onChange(match.value);
        }}
        className={inputClass}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <p className="text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

export function TextField({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: ReactNode }) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input id={id} className={inputClass} spellCheck={false} autoComplete="off" {...props} />
      {hint ? <p className="text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: ReactNode;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-600 accent-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400"
      />
      <div>
        <label htmlFor={id} className="text-sm text-slate-200">
          {label}
        </label>
        {hint ? <p className="text-xs text-slate-400">{hint}</p> : null}
      </div>
    </div>
  );
}
