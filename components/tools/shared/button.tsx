import type { ButtonHTMLAttributes, ReactNode } from "react";
import { focusRing } from "./styles";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const variantClass: Record<Variant, string> = {
  primary: "bg-cyan-500 font-medium text-slate-950 hover:bg-cyan-400 disabled:bg-cyan-500/40",
  secondary: "border border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-500 hover:text-cyan-200 disabled:opacity-50",
  ghost: "text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-50",
};

const sizeClass: Record<Size, string> = {
  sm: "gap-1.5 rounded-lg px-2.5 py-1.5 text-xs",
  md: "gap-2 rounded-lg px-3.5 py-2 text-sm",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
};

export default function Button({ variant = "secondary", size = "md", icon, className = "", children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center transition disabled:cursor-not-allowed ${variantClass[variant]} ${sizeClass[size]} ${focusRing} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
