"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Eraser, FileUp, RotateCcw, Sparkles } from "lucide-react";
import { downloadBlob, downloadText } from "@/lib/client/download";
import Button, { type ButtonProps } from "./button";

export function useCopy(resetMs = 1500) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      clearTimeout(timer.current);
      try {
        await navigator.clipboard.writeText(text);
        setState("copied");
      } catch {
        setState("failed");
      }
      timer.current = setTimeout(() => setState("idle"), resetMs);
    },
    [resetMs],
  );

  return { state, copy };
}

type ActionProps = Omit<ButtonProps, "onClick" | "icon">;

export function CopyButton({ text, label = "Copy", ...props }: ActionProps & { text: string; label?: string }) {
  const { state, copy } = useCopy();
  return (
    <>
      <Button
        size="sm"
        disabled={!text}
        icon={state === "copied" ? <Check aria-hidden className="h-3.5 w-3.5" /> : <Copy aria-hidden className="h-3.5 w-3.5" />}
        onClick={() => void copy(text)}
        {...props}
      >
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : label}
      </Button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? `${label}: copied to clipboard` : state === "failed" ? "Copy failed. Select the text and copy it manually." : ""}
      </span>
    </>
  );
}

export function DownloadButton({
  filename,
  text,
  blob,
  mimeType,
  label = "Download",
  ...props
}: ActionProps & { filename: string; text?: string; blob?: () => Blob | Promise<Blob>; mimeType?: string; label?: string }) {
  const disabled = props.disabled ?? (!text && !blob);
  return (
    <Button
      size="sm"
      icon={<Download aria-hidden className="h-3.5 w-3.5" />}
      {...props}
      disabled={disabled}
      onClick={async () => {
        if (blob) {
          downloadBlob(filename, await blob());
        } else if (text) {
          downloadText(filename, text, mimeType);
        }
      }}
    >
      {label}
    </Button>
  );
}

export function ClearButton({ onClear, label = "Clear", ...props }: ActionProps & { onClear: () => void; label?: string }) {
  return (
    <Button size="sm" icon={<Eraser aria-hidden className="h-3.5 w-3.5" />} onClick={onClear} {...props}>
      {label}
    </Button>
  );
}

export function ResetButton({ onReset, label = "Reset", ...props }: ActionProps & { onReset: () => void; label?: string }) {
  return (
    <Button size="sm" icon={<RotateCcw aria-hidden className="h-3.5 w-3.5" />} onClick={onReset} {...props}>
      {label}
    </Button>
  );
}

export function ExampleButton({ onLoad, label = "Load example", ...props }: ActionProps & { onLoad: () => void; label?: string }) {
  return (
    <Button size="sm" icon={<Sparkles aria-hidden className="h-3.5 w-3.5" />} onClick={onLoad} {...props}>
      {label}
    </Button>
  );
}

export const MAX_FILE_BYTES = 10 * 1024 * 1024;

type FileOpenProps = {
  accept: string;
  maxBytes?: number;
  label?: string;
  onError: (message: string) => void;
} & (
  | { mode: "text"; onLoad: (text: string, file: File) => void }
  | { mode: "arrayBuffer"; onLoad: (data: ArrayBuffer, file: File) => void }
);

/** Reads a local file in the browser. The file is never uploaded. */
export function FileOpenButton(props: FileOpenProps) {
  const { accept, maxBytes = MAX_FILE_BYTES, label = "Open file", onError } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) {
            return;
          }
          if (file.size > maxBytes) {
            onError(`${file.name} is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${(maxBytes / 1024 / 1024).toFixed(0)} MB.`);
            return;
          }
          try {
            if (props.mode === "text") {
              props.onLoad(await file.text(), file);
            } else {
              props.onLoad(await file.arrayBuffer(), file);
            }
          } catch {
            onError(`Could not read ${file.name}.`);
          }
        }}
      />
      <Button size="sm" icon={<FileUp aria-hidden className="h-3.5 w-3.5" />} onClick={() => inputRef.current?.click()}>
        {label}
      </Button>
    </>
  );
}
